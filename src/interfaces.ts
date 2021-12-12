export interface Goal {
    /** Info about Goal */
    target: {
        current: number
        target: number
        progress: number
    }

    /** Goal Title */
    title: string

    /** Page URL */
    url: string
}

export interface leaderboard {
    /**
     * Page Link
     * @example trakteer.id/xxx
     */
    "pageUrl": string
    /**
     * Unit icon URL
     * @returns URL or null if not exist
     * @example https://trakteer.id/storage/images/units/uic-6HrRTI84iwV97h7TcpJta4RcK0jhRbxK1620058283.png
     */
    "unitIcon": string | null
    /**
     * Unit name
     */
    "unitName": string

    /**
     * Supporter list
     */
    "supporter": [
        {
            /**
             * Supporter name
             * @returns String or "" if null
             */
            "supporter_name": string | ""
            /**
             * Avatar URL
             * @returns URL or Null if no avatar
             * @example https:\/\/lh3.googleusercontent.com\/a-\/AOh14Gi45Ig9QTQozpqkD_SgPcB190KAwStLhex1Y-CT5w=s96-c
             */
            "avatar":  string | null
            /**
             * Total donation
             */
            "sum": number
        }
    ] | []
}
