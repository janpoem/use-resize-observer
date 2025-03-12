# @zenstone/use-resize-observer

又又又又双双双叒叒叕一个 React Resize Observer 钩子。

- 支持 `enable` 来控制是否启用监听，为 `false` 时可中断监听（我好像在说废话）
- `onChange` 返回标准 DOM ResizeObserverEntry ，具体如何使用，根据应用场景去读取数据
- 触发 resize 时，该钩子内部不会更新任何 state，具体如何和组件的 state 同步，可自行决定

## 安装说明

```bash
bun add @zenstone/use-resize-observer
# or
npm i @zenstone/use-resize-observer
```

## 使用例子

```tsx
const App = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enable, setEnable] = useState(false);

  useResizeObserver(ref, {
    enable,
    onChange(
      // DOM 标准的 ResizeObserverEntry
      entry: ResizeObserverEntry,
      // 触发次数
      times: number
    ) {
      console.log(entry.borderBoxSize);
    },
  });

  return (
    <Box
      ref={ref}
      display={'flex'}
      flexDirection={'column'}
      flex={'1 1 auto'}
      sx={{ background: '#ccc' }}
    >
      <Button onClick={() => setEnable((prev) => !prev)}>
        {enable ? 'disable' : 'enable'}
      </Button>
    </Box>
  );
};
```

## 补充说明

引用了 `usehooks-ts@3.1.1` 的 `useEventCallback` 和 `useIsomorphicLayoutEffect`
，本来希望利用 rollup 的打包机制自动引入代码。

但这版本的 `usehooks-ts` 会默认把 lodash debounce 的部分代码一同打包，实际上根本用不到这一块的代码，所以暂时将
`useEventCallback` 和 `useIsomorphicLayoutEffect` 的代码复制进来。
