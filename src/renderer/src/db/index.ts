import { DBStoreName } from '@renderer/enums/store'
import { toRaw } from 'vue'

function UPGRADE_0_1(db: IDBDatabase) {
  const store = db.createObjectStore(DBStoreName.FAVORITE, {
    keyPath: 'id'
  })

  store.createIndex('id', 'id', {
    unique: true
  })

  const store2 = db.createObjectStore(DBStoreName.HISTORY, {
    keyPath: 'id'
  })

  store2.createIndex('id', 'id', {
    unique: true
  })
}

function UPGRADE_1_2(transaction: IDBTransaction) {
  const store1 = transaction.objectStore(DBStoreName.HISTORY)
  store1.createIndex('updateTime', 'updateTime')

  const store2 = transaction.objectStore(DBStoreName.FAVORITE)
  store2.createIndex('updateTime', 'updateTime')
}

function UPGRADE_2_3(db: IDBDatabase) {
  const store = db.createObjectStore(DBStoreName.SEARCH_HISTORY, {
    keyPath: 'name'
  })
  store.createIndex('name', 'name', {
    unique: false
  })
  store.createIndex('updateTime', 'updateTime')
}

function UPGRADE_3_4(db: IDBDatabase) {
  const store = db.createObjectStore(DBStoreName.FAVORITE_PLAYLIST, {
    keyPath: 'id'
  })

  store.createIndex('id', 'id', {
    unique: true
  })

  store.createIndex('updateTime', 'updateTime')

  store.createIndex('name', 'name')
}

export function openDB() {
  let _db: IDBDatabase | null = null

  return (): Promise<IDBDatabase> => {
    if (_db !== null) return Promise.resolve(_db)

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('music', 4)
      let isShowError = false
      request.onerror = () => {
        console.error('数据库连接失败')
        if (isShowError) {
          return
        }
        isShowError = true
        alert('数据库连接失败！')
        reject(new Error('数据库连接失败'))
      }

      request.onsuccess = (event: any) => {
        const db = event.target.result
        // console.log('onSuccess: ', db)
        _db = db
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        console.log('onUpgradeneeded:', event.oldVersion, event.newVersion)
        const db = (event.target as any).result as IDBDatabase
        _db = db

        for (
          let versionToCreate = event.oldVersion + 1;
          versionToCreate <= (event.newVersion || 1);
          versionToCreate++
        ) {
          switch (versionToCreate) {
            case 1:
              UPGRADE_0_1(db)
              break
            case 2:
              UPGRADE_1_2((event.target as any).transaction as IDBTransaction)
              break
            case 3:
              UPGRADE_2_3(db)
              break
            case 4:
              UPGRADE_3_4(db)
              break
          }
        }
      }
    })
  }
}

export async function addData<T>(storeName: string, data: T) {
  const request = (await openDB()())
    .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .add(toRaw(data))

  return new Promise((resolve, reject) => {
    request.onerror = (error) => {
      console.error('插入数据失败: ', error)
      reject(new Error('插入数据失败'))
    }
    request.onsuccess = () => {
      resolve(true)
    }
  })
}

export async function updateData<T>(storeName: string, data: T) {
  const request = (await openDB()())
    .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .put(toRaw(data))

  return new Promise((resolve, reject) => {
    request.onerror = (error) => {
      console.error('更新数据失败: ', error)
      reject(new Error('更新数据失败'))
    }
    request.onsuccess = () => {
      resolve(true)
    }
  })
}

export async function getDataByKey<T>(storeName: string, key: any): Promise<T> {
  const db = await openDB()()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]) // 事务
    const objectStore = transaction.objectStore(storeName) // 仓库对象
    const request = objectStore.get(key) // 通过主键获取数据

    request.onerror = function () {
      console.log('事务失败')
      reject(new Error('查询失败'))
    }

    request.onsuccess = function () {
      resolve(request.result)
    }
  })
}

export async function deleteData(storeName: string, key: any) {
  const db = await openDB()()
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(key)

    request.onerror = function () {
      console.log('删除失败')
      reject(new Error('删除失败'))
    }

    request.onsuccess = function () {
      console.log('删除结果: ', request.result)
      resolve(request.result)
    }
  })
}

interface QueryPageParams<T = any> {
  storeName: string
  pageNo?: number
  pageSize?: number
  indexName?: keyof T
  direction?: 'next' | 'nextunique' | 'prev' | 'prevunique'
}

export async function getDataCount(storeName: string): Promise<number> {
  const db = await openDB()()
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], 'readonly').objectStore(storeName).count()

    request.onsuccess = (event: any) => {
      resolve(Number(event.target.result || 0))
    }

    request.onerror = () => {
      reject(new Error('获取失败'))
    }
  })
}

/**
 * 获取分页数据
 * @param params 查询参数
 */
export async function getPageData<T>(params: QueryPageParams<T>) {
  const { storeName, pageNo = 1, pageSize = 20 } = params
  const db = await openDB()()
  return new Promise<T[]>((resolve, reject) => {
    const store = db.transaction([storeName], 'readwrite').objectStore(storeName)

    let request: IDBRequest<IDBCursorWithValue>
    if (params.indexName) {
      request = store.index(params.indexName as string).openCursor(null, params.direction || 'prev')
    } else {
      request = store.openCursor()
    }

    let skip = true
    let count = 0
    const list: T[] = []

    request.onsuccess = (event: any) => {
      let cursor = event.target.result as IDBCursorWithValue | null
      if (pageNo > 1 && skip) {
        skip = false
        cursor?.advance((pageNo - 1) * pageSize)
        return
      }

      if (cursor) {
        list.push(cursor.value)
        count++
        if (count < pageSize) {
          cursor.continue()
        } else {
          cursor = null
          resolve(list)
        }
      } else {
        resolve(list)
      }
    }

    request.onerror = () => {
      reject(new Error('分页查询失败'))
    }
  })
}

export async function clearData(storeName: string) {
  const db = await openDB()()
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).clear()
    request.onsuccess = () => {
      resolve(true)
    }
    request.onerror = () => {
      reject(new Error('清除数据失败'))
    }
  })
}
