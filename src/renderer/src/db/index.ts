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

export function openDB() {
  let _db: IDBDatabase | null = null

  return (): Promise<IDBDatabase> => {
    if (_db !== null) return Promise.resolve(_db)

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('music', 1)
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
              // UPGRADE_1_2(db)
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
    request.onerror = () => {
      console.error('插入数据失败')
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
    request.onerror = () => {
      console.error('更新数据失败')
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

interface QueryPageParams {
  storeName: string
  pageNo?: number
  pageSize?: number
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

export async function getPageData<T>(params: QueryPageParams) {
  const { storeName, pageNo = 1, pageSize = 20 } = params
  const db = await openDB()()
  return new Promise<T[]>((resolve, reject) => {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).openCursor()

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
