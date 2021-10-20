import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { PaginationRenderItemParams } from '@material-ui/lab';
import { forwardRef } from 'react';
import getAsaString from '../getAsaString';

export interface MaterialUiLinkProps {
    item: PaginationRenderItemParams,
    query: ParsedUrlQuery,
}

const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(({ item, query, ...props }, ref) => (
    <Link
        href={{
            pathname: '/cars',
            query: {
                ...query,
                page: item.page
            }
        }}
        shallow // just change the url if you gonna stay at the same page ('to avoid recall getServerSideProps for example');
    >
        <a ref={ref} {...props}>
        </a>
    </Link>
));

const CarPagination = ({ totalPage }: { totalPage: number }) => {
    const { query } = useRouter();
    return (
        <Pagination
            page={+(getAsaString(query.page) || '1')}
            count={totalPage}
            renderItem={(item) => (
                <PaginationItem
                    component={MaterialUiLink}
                    query={query}
                    item={item}
                    {...item}
                />
            )}
        />
    )
}

export default CarPagination
