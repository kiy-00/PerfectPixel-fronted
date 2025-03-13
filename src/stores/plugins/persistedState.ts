/**inia'
 * 创建一个Pinia插件，用于持久化存储状态到localStorage
 */
export function createPersistedState(
  options: {
    key?: string
    paths?: string[]
    storage?: Storage
  } = {},
) {
  const { key = 'pinia', paths = [], storage = localStorage } = options

  const getState = () => {
    const state = storage.getItem(key)
    return state ? JSON.parse(state) : {}
  }

  const setState = (state: any) => {
    storage.setItem(key, JSON.stringify(state))
  }

  // 返回一个插件函数，不使用类型声明
  return (context: any) => {
    const { store } = context

    // 在store初始化时恢复状态
    const persistedState = getState()[store.$id]
    if (persistedState) {
      store.$patch(persistedState)
      console.log(`从持久化存储恢复状态：${store.$id}`)
    }

    // 监听状态变化保存到存储
    store.$subscribe(
      (mutation: any, state: any) => {
        const stateToPersist = paths.length
          ? paths.reduce((acc: any, path: string) => {
              const pathParts = path.split('.')
              let value = state
              for (const part of pathParts) {
                value = value[part]
              }
              return { ...acc, [path]: value }
            }, {})
          : state

        const persistedStates = getState()
        persistedStates[store.$id] = stateToPersist
        setState(persistedStates)
        console.log(`状态已保存到持久化存储：${store.$id}`)
      },
      { detached: true },
    )
  }
}
