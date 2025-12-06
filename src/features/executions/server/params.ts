import { parseAsInteger, parseAsString } from "nuqs/server";
import {PAGINATION_LIMIT} from "@/config/constants";

export const executionsParams = {
 page : parseAsInteger
    .withDefault(PAGINATION_LIMIT.DEFAULT_PAGE)
    .withOptions({clearOnDefault : true}),
 pageSize : parseAsInteger
    .withDefault(PAGINATION_LIMIT.DEFAULT_PAGE_SIZE)
    .withOptions({clearOnDefault : true}),
 search: parseAsString
    .withDefault('')
    .withOptions({clearOnDefault : true})
}
