'use strict'

class Auth {
  async gqlHandle (resolve, root, args, ctx, info) {
    try {
      await ctx.auth.check()
    } catch (err) {
      return err
    }
    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = Auth
