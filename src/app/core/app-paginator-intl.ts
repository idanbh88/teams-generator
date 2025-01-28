import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable()
export class AppPaginatorIntl extends MatPaginatorIntl {
    override itemsPerPageLabel = 'הצג:';
    override nextPageLabel = 'הבא';
    override previousPageLabel = 'הקודם';
    override firstPageLabel = 'עמוד ראשון';
    override lastPageLabel = 'עמוד אחרון';
    override  getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 מתוך ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `${startIndex + 1} - ${endIndex} מתוך ${length}`;
    };
}