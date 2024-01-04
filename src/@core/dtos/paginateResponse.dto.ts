import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<TData> {
    @ApiProperty()
    docs: TData[];

    @ApiProperty({ type: Number })
    totalDocs: number;

    @ApiProperty({ type: Number })
    limit: number;

    @ApiProperty({ type: Boolean })
    hasPrevPage: boolean;

    @ApiProperty({ type: Boolean })
    hasNextPage: boolean;

    @ApiProperty({ type: Number })
    page?: number | undefined;

    @ApiProperty({ type: Number })
    totalPages: number;

    @ApiProperty({ type: Number })
    offset: number;

    @ApiProperty({ type: Number })
    prevPage?: number | null | undefined;

    @ApiProperty({ type: Number })
    nextPage?: number | null | undefined;

    @ApiProperty({ type: Number })
    pagingCounter: number;

    @ApiProperty()
    meta?: any;
}
