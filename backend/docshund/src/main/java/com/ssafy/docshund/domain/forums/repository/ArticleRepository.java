package com.ssafy.docshund.domain.forums.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.docshund.domain.forums.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer>, ArticleRepositoryCustom{
}
