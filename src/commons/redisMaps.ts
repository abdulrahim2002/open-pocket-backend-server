/**
 * @description
 * Define <field_type>:<value_type>
 *
 * 1. userId_refreshToken maps userId       -> refreshToken
 * 2. refreshToken_userId maps refreshToken -> userId
**/
enum redisMaps {
    userId_refreshToken="user_id:refresh_token",
    refreshToken_userId="refresh_token:user_id",
}

export default redisMaps;
