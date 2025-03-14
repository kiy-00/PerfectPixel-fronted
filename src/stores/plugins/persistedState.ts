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
              let validPath = true

              // 安全地遍历路径，避免 undefined 的属性访问
              for (const part of pathParts) {
                if (value === undefined || value === null) {
                  validPath = false
                  break
                }
                value = value[part]
              }

              // 只有当路径有效时才添加到累积对象中
              return validPath ? { ...acc, [path]: value } : acc
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
