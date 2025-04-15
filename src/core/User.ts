import axios from "axios";
import Cache from "../etc/Cache";
import UserSummary from "../types/UserSummary";

export class User {
    /**
     * Mendapatkan ID user dari page id
     * @param pageId Page id
     * @returns ID user
     */
    static async getUserId(pageId: string): Promise<string | Error> {
        const cache = Cache.get<string>(`userId_${pageId}`);

        if (cache) return cache.data;

        const req = await axios
            .get(`https://trakteer.id/${pageId}`)
            .catch((e) => {
                throw new Error("User not found/Something not working");
            });
        const UserId = req.data.match(/(?<=creator-id=")(.*?)(?=\")/);

        if (req.status === 200 && !UserId)
            throw new Error("User not found/Invalid page id/Inactive page");

        if (!UserId[0]) throw new Error("Invalid page id");
        Cache.set(`userId_${pageId}`, UserId[0], 60000);
        return UserId[0];
    }

    /**
     * Mendapatkan detail user
     * @param userId ID user
     * @returns Detail user
     */
    static async getUserDetails(userId: string): Promise<UserSummary | Error> {
        const cache = Cache.get<{ data: UserSummary }>(`userDetails_${userId}`);

        if (cache) return cache.data.data;

        const req = await axios
            .get<{
                data: UserSummary;
            }>(`https://api.trakteer.id/v2/fe/creator/${userId}/summary`)
            .catch((e) => {
                if (e.status === 422) throw new Error("ID user tidak valid");
                throw e;
            });

        if (req.status !== 200) throw new Error("ID user tidak valid");

        Cache.set(`userDetails_${userId}`, req.data, 60000);
        return req.data.data;
    }
}
