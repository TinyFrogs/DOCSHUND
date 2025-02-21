package com.ssafy.docshund.domain.users.repository;

import com.ssafy.docshund.domain.users.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemoRepository extends JpaRepository<Memo, Integer> {

    List<Memo> findByUserUserId(Long userId);

    Optional<Memo> findByMemoIdAndUserUserId(Integer memoId, Long userId);
}
