import { isClient } from "vitepress-theme-teek";

interface UseDocBgLayerOptions {
  /**
   * 自定义样式
   */
  styles?: Partial<CSSStyleDeclaration>;
  /**
   * 背景图片透明度
   */
  opacity?: number;
  /**
   * 切换动画持续时间
   */
  duration?: number;
}

// 创建图片层
const createDocBgLayer = (styles: Partial<CSSStyleDeclaration>): HTMLImageElement => {
  // 规避编译时 SSR 错误
  if (!isClient) return;

  const docBgLayer: HTMLImageElement = document.createElement('img');
  Object.assign(docBgLayer.style, styles);
  docBgLayer.dataset.src = '';
  docBgLayer.src = '';
  document.body.appendChild(docBgLayer);
  return docBgLayer;
};

// 导出
export const useDocBgImage = (options: UseDocBgLayerOptions = {}) => {
  // 默认样式
  const styles: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-1',
    pointerEvents: 'none',
    filter: 'blur(8px)',
    opacity: '0',
    transition: 'opacity ease-out',
    ...options.styles,
  };

  // 背景图片透明度
  const opacity: number = options.opacity ?? 0.25;
  // 切换动画持续时间
  const duration: number = options.duration ?? 0.7;

  // 创建两个层，用于切换图片时一个消失一个加载
  const docBgLayer0: HTMLImageElement = createDocBgLayer(styles);
  const docBgLayer1: HTMLImageElement = createDocBgLayer(styles);
  // 标记当前显示的层
  let activeDocBgLayer: number = 0;
  // 待切换的图片队列
  const pendingImages: string[] = [];
  // 标记当前是否正在切换图片
  let isSwitching: boolean = false;

  // 切换图片
  const switchDocBgImage = (nextSrc: string): void => {
    // 规避编译时 SSR 错误
    if (!isClient) return;

    // 添加到队列
    pendingImages.push(nextSrc);

    // 从队列中获取图片切换
    const innerSwitchDocBgImage = () => {
      // 如果正在切换图片，则跳过，等待切换完毕后的回调
      if (isSwitching) return;

      // 加锁
      isSwitching = true;

      // 直接获取队列中的最后一张图片
      const nextSrc: string = pendingImages[pendingImages.length - 1];
      // 队列清空
      pendingImages.length = 0;
      // P.S.
      // 经过询问 Deepseek，由于 js 的单线程事件循环模型执行机制，此处不会出现线程同步问题
      // 无须担心在获取图片和队列清空之间，其他线程入队图片

      // 获取新旧层
      const oldBgLayer: HTMLImageElement = activeDocBgLayer === 0 ? docBgLayer0 : docBgLayer1;
      const newBgLayer: HTMLImageElement = activeDocBgLayer === 0 ? docBgLayer1 : docBgLayer0;

      // 相同图片不切换
      if (oldBgLayer.dataset.src === nextSrc) {
        // 解锁
        isSwitching = false;
        // 尝试切换下一个图片
        if (pendingImages.length > 0) setTimeout(innerSwitchDocBgImage, 0);
        return;
      }

      // 旧图不存在且新图不存在
      if (oldBgLayer.dataset.src === '' && nextSrc === '') {
        // 解锁
        isSwitching = false;
        // 尝试切换下一个图片
        if (pendingImages.length > 0) setTimeout(innerSwitchDocBgImage, 0);
        return;
      }

      // 完成新动画后的回调
      const handleNewTransitionEnd = (event: TransitionEvent) => {
        // 移除回调
        event.target.removeEventListener('transitionend', handleNewTransitionEnd);
        // 解锁
        isSwitching = false;
        // 尝试切换下一个图片
        if (pendingImages.length > 0) setTimeout(innerSwitchDocBgImage, 0);
      };

      // 旧图不存在且新图存在，直接挂载并显示新图
      if (oldBgLayer.dataset.src === '') {
        oldBgLayer.src = nextSrc;
        oldBgLayer.dataset.src = nextSrc;
        oldBgLayer.style.transitionDuration = `${duration}s`
        oldBgLayer.style.opacity = `${opacity}`;
        oldBgLayer.addEventListener('transitionend', handleNewTransitionEnd);
        return;
      }

      // 旧图存在但新图不存在，直接消失旧图
      if (nextSrc === '') {
        oldBgLayer.dataset.src = '';
        oldBgLayer.style.transitionDuration = `${duration}s`
        oldBgLayer.style.opacity = "0.0";
        oldBgLayer.addEventListener('transitionend', handleNewTransitionEnd);
        return;
      }

      // 旧图存在且新图存在，更新状态，切图
      activeDocBgLayer = activeDocBgLayer === 0 ? 1 : 0;
      // 旧图消失事件处理
      const handleOldTransitionEnd = () => {
        // 消失完成后移除回调
        oldBgLayer.removeEventListener('transitionend', handleOldTransitionEnd);
        // 新图开始显示
        newBgLayer.style.transitionDuration = `${duration / 2}s`
        newBgLayer.style.opacity = `${opacity}`;
        newBgLayer.addEventListener('transitionend', handleNewTransitionEnd);
      };
      // 更新新图并挂载，但不显示，透明度为 0
      newBgLayer.src = nextSrc;
      newBgLayer.dataset.src = nextSrc;
      // 监听旧图消失
      oldBgLayer.addEventListener('transitionend', handleOldTransitionEnd);
      // 开始消失旧图
      oldBgLayer.style.transitionDuration = `${duration / 2}s`
      oldBgLayer.style.opacity = "0.0";
    };

    // 尝试切换
    innerSwitchDocBgImage();
  }

  return { switchDocBgImage };
};