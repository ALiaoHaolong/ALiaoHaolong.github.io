export const useRefreshDetection = () => {
  // 常量
  const DEPLOYMENT_DATA_STORAGE_KEY = "lhl:deployment";
  const url = "https://api.github.com/repos/ALiaoHaolong/ALiaoHaolong.github.io/deployments?ref=master&environment=github-pages&per_page=1";

  const innerCheckDeployment = async () => {
    let isOutdated: boolean = false;

    // 获取缓存
    const cached: string | null = localStorage.getItem(DEPLOYMENT_DATA_STORAGE_KEY);
    // 解析缓存
    const deploymentData: { lastRequestAt: number, lastDeploymentAt: string } = cached ? JSON.parse(cached) : {};

    // 如果缓存存在，检查请求频率
    if (cached) {
      // 30 分钟内请求过，不处理
      if (Date.now() - deploymentData.lastRequestAt < 30 * 60 * 1000) {
        console.debug("部署检查：忽略");
        return isOutdated;
      }
      // 超过 30 分钟间隔，可以重新请求
    }

    // 使用原生方式获取数据
    const res = await fetch(url);
    // 解析 JSON
    const data: any[] = await res.json();
    // 获取最后更新时间
    const lastDeploymentAt: string = data[0].updated_at;

    // 更新最后请求时间
    deploymentData.lastRequestAt = Date.now();

    // 第一次访问
    if (!cached) {
      // 更新最后部署时间
      deploymentData.lastDeploymentAt = lastDeploymentAt;
    } else {
      // 非首次访问，比较最后部署时间
      if (deploymentData.lastDeploymentAt !== lastDeploymentAt) {
        // 时间不一致，更新最后部署时间
        // （如果用户最终同意刷新，则必然更新最后部署时间；如果用户最终不同意刷新，则忽略本次更新，同样需要更新最后部署时间）
        deploymentData.lastDeploymentAt = lastDeploymentAt;
        // 设置返回值
        isOutdated = true;
      }
    }

    // 缓存数据
    localStorage.setItem(DEPLOYMENT_DATA_STORAGE_KEY, JSON.stringify(deploymentData));

    if (isOutdated) console.debug("部署检查：当前版本不是最新版本。");
    else            console.debug("部署检查：当前版本已是最新。");

    return isOutdated;
  };

  const checkDeployment = () => {
    // 暂不启用
    // innerCheckDeployment().then(isOutdated => {
    //   if (isOutdated && confirm("检测到有新版本，是否刷新页面？"))
    //     location.reload();
    // });
  }

  return { checkDeployment };
};