// 组件模块化
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, any>;
  export default component;
}
// 宽容 index.ts 中的 css / scss 导入
declare module '*.css';
declare module '*.scss';