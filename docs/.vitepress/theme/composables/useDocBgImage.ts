import { isClient } from "vitepress-theme-teek";

interface UseDocBgLayerOptions {
  /**
   * 自定义样式
   */
  styles?: Partial<CSSStyleDeclaration>;
}

// 创建图片层
const createDocBgLayer = (styles: Partial<CSSStyleDeclaration>) => {
  if (!isClient) return;

  const docBgLayer = document.createElement('img');
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

  // 创建两个层，用于切换图片时一个消失一个加载
  const docBgLayer0 = createDocBgLayer(styles);
  const docBgLayer1 = createDocBgLayer(styles);
  // 标记当前显示的层
  let activeDocBgLayer = 0;

  // 切换图片
  const switchDocBgImage = (nextSrc: string) => {
    if (!isClient) return;

    // 获取新旧层
    const oldBgLayer = activeDocBgLayer === 0 ? docBgLayer0 : docBgLayer1;
    const newBgLayer = activeDocBgLayer === 0 ? docBgLayer1 : docBgLayer0;

    // 相同图片不切换
    if (oldBgLayer.dataset.src === nextSrc) return;

    // 旧图不存在且新图不存在
    if (oldBgLayer.dataset.src === '' && nextSrc === '') return;

    // 旧图不存在且新图存在，直接挂载并显示新图
    if (oldBgLayer.dataset.src === '') {
      oldBgLayer.src = nextSrc;
      oldBgLayer.dataset.src = nextSrc;
      oldBgLayer.style.transitionDuration = "0.7s"
      oldBgLayer.style.opacity = "0.25";
      return;
    }

    // 旧图存在但新图不存在，直接消失旧图
    if (nextSrc === '') {
      oldBgLayer.dataset.src = '';
      oldBgLayer.style.transitionDuration = "0.7s"
      oldBgLayer.style.opacity = "0.0";
      return;
    }

    // 旧图存在且新图存在，更新状态，切图
    activeDocBgLayer = activeDocBgLayer === 0 ? 1 : 0;
    // 旧图消失事件处理
    const handleTransitionEnd = () => {
      // 消失完成后卸载旧图
      oldBgLayer.removeEventListener('transitionend', handleTransitionEnd);
      // 新图开始显示
      newBgLayer.style.transitionDuration = "0.35s"
      newBgLayer.style.opacity = "0.25";
    };
    // 更新新图并挂载，但不显示，透明度为 0
    newBgLayer.src = nextSrc;
    newBgLayer.dataset.src = nextSrc;
    // 监听旧图消失
    oldBgLayer.addEventListener('transitionend', handleTransitionEnd);
    // 开始消失旧图
    oldBgLayer.style.transitionDuration = "0.35s"
    oldBgLayer.style.opacity = "0.0";
  }

  return { switchDocBgImage };
};