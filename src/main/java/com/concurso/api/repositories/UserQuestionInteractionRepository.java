package com.concurso.api.repositories;

import com.concurso.api.models.UserQuestionInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserQuestionInteractionRepository extends JpaRepository<UserQuestionInteraction, UUID> {
    
    List<UserQuestionInteraction> findByUserId(UUID userId);
    
    List<UserQuestionInteraction> findByUserIdAndIsReviewedTrue(UUID userId);
    
    long countByUserIdAndIsCorrectTrue(UUID userId);
}
