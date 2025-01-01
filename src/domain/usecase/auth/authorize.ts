import {IUser} from '@/domain/entity/user';
import { UnauthorizedError } from '@/domain/errors';
import { UseCaseParams } from '../types';

export type Authorize = (data: {
  email: string,
  password: string,
}) =>
    Promise<{
      user: IUser,
      accessToken: string
    } | never>

export const buildAuthorize = ({
  service,
  adapter
}: UseCaseParams): Authorize => {
  return async ({email, password}) => {
    
    let user = await service.auth.checkCredentials({
      email,
      password
    })
    console.log(user)
    if (!user) {
      throw new UnauthorizedError()
    }

    user = await adapter.userRepository.get({
      where: {
        id: user.id
      },
      select: {
        id: true,
        email: true,
        avatar: true,
        created_at: true
      }
    });

    if (!user) {
      throw new UnauthorizedError()
    }

    const {refreshToken, accessToken} = await service.auth.signAuthTokens({
      user
    })

    return {
      user,
      accessToken,
      refreshToken
    }
  }
}
