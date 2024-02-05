import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { getCategoryProductListHandler, getProductListHandler } from '../../api/Supabase.api';
import { userSession } from '../../state/atom/userSessionAtom';
import { ProductsTypes } from '../../types/types';
import ProductsLike from '../common/like/ProductsLike';
import Pagination from '../common/pagination/Pagination';
import * as St from './MarketList.styled';
import { categoryArr } from './marketpost/Post';

const MarketList = () => {
  const [list, setList] = useState<ProductsTypes[]>([]);
  //페이지네이션 state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const session = useRecoilValue(userSession);

  const navigate = useNavigate();
  const params = useParams().id;
  const category = categoryArr[Number(params)];

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = list?.slice(indexOfFirst, indexOfLast);

  const getProductList = async () => {
    if (params) {
      const result = await getCategoryProductListHandler(category);
      setList(result.sort((a, b) => b.id - a.id));
    } else {
      const result = await getProductListHandler();
      setList(result.sort((a, b) => b.id - a.id));
    }
  };

  const onClickPostBtn = () => {
    session ? navigate('/marketpost') : window.confirm('로그인 페이지로 이동하시겠습니까?') && navigate(`/login`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getProductList();
  }, [params]);

  return (
    <St.Container>
      <St.CategoryWrapper>
        <St.CategoryTitle
          onClick={() => {
            navigate(`/market`);
          }}>
          카테고리
        </St.CategoryTitle>
        <St.CategoryBtnBox>
          {categoryArr.map((item, i) => (
            <St.CategoryBtn
              key={i}
              onClick={() => navigate(`/market/${i}`)}
              className={i === Number(params) ? 'active' : ''}>
              {item}
            </St.CategoryBtn>
          ))}
        </St.CategoryBtnBox>
      </St.CategoryWrapper>{' '}
      <St.ContentsWrapper>
        <St.Title>
          {category ? category : '중고거래'}
          <St.PostButton onClick={onClickPostBtn}>글쓰기</St.PostButton>
        </St.Title>
        <St.Contour />
        <St.MobileCategory>
          <select>
            {categoryArr.map((item, i) => {
              return <option key={i}>{item}</option>;
            })}
          </select>
          <St.MobilePostButton onClick={onClickPostBtn}>글쓰기</St.MobilePostButton>
        </St.MobileCategory>
        <St.ProductsWrapper>
          {currentPosts.map((item, i) => {
            return (
              <St.ProductCard
                key={i}
                className={item.onsale ? '' : 'soldout'}
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  window.scrollTo(0, 0);
                }}>
                {item.product_img?.length === 0 ? (
                  <St.LogoImage />
                ) : (
                  <St.ProductImg>
                    <img
                      src={(item.product_img && item.product_img[0]) ?? undefined}
                      width={200}
                      height={260}
                      loading="lazy"
                      alt="상품이미지"
                    />
                  </St.ProductImg>
                )}
                <St.CardTitleAndContentBox>
                  <St.TitleLikes>
                    <St.ProductTitle>{item.title}</St.ProductTitle>
                    <ProductsLike postId={item.id} count={false} />
                  </St.TitleLikes>
                  <St.ProductInfo>
                    <St.ProductPrice>{item.price} 원</St.ProductPrice>
                    <St.ProductCreatedAt>{dayjs(item.created_at).format('MM-DD')}</St.ProductCreatedAt>
                  </St.ProductInfo>
                </St.CardTitleAndContentBox>
                {item.onsale ? null : <St.Onsale>판매 완료</St.Onsale>}
              </St.ProductCard>
            );
          })}
        </St.ProductsWrapper>
        <St.PaginationWrapper>
          <Pagination postsPerPage={postsPerPage} totalPosts={list.length} paginate={setCurrentPage} />
        </St.PaginationWrapper>
      </St.ContentsWrapper>
    </St.Container>
  );
};

export default MarketList;
