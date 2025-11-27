import {format, formatDistanceToNow, parseISO} from "date-fns";

export const dateFull = (s: string) => {
    try {
        return format(parseISO(s), "yyyy-MM-dd HH:mm:ss");
    } catch {
        return s;
    }
};
export const dateRelative = (s: string) => {
    try {
        return formatDistanceToNow(parseISO(s), {addSuffix: true});
    } catch {
        return s;
    }
};
