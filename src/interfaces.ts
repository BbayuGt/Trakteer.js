export interface Goal {
    /** Info about Goal */
    target:{
        current:number
        target:number
        progress:number
    }

    /** Goal Title */
    title:string

    /** Page URL */
    url:string
}