package com.concurso.api.repositories;

import com.concurso.api.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    
    List<Question> findByCategoryId(UUID categoryId);
    
    @Query(value = "SELECT * FROM questions WHERE category_id = :categoryId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestionsByCategory(UUID categoryId, int limit);
}
