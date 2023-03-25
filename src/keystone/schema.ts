import { list } from "@keystone-6/core"
import { allowAll, denyAll, allOperations } from "@keystone-6/core/access"
import { text, password, timestamp } from "@keystone-6/core/fields"
import type { Lists } from ".keystone/types"

type SessionData = {
  listKey: string
  itemId: string
  data?: {
    id: string
    email: string
    name: string
    createdAt: string
  }
}

type Session = {
  session: SessionData
}

const permissions = {
  authenticatedUser: ({ session }: Session) => !!session?.data,
  public: () => true,
  readOnly: {
    operation: {
      // deny create/read/update/delete
      ...allOperations(denyAll),
      // override the deny and allow only query
      query: allowAll
    }
  }
}

export const lists: Lists = {
  User: list({
    // readonly for demo purpose
    access: permissions.readOnly,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        access: {
          // email only visible to authenticated users
          read: permissions.authenticatedUser
        }
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: "now" }
      })
    }
  })
}
