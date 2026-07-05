package com.concurso.api.repositories;

import com.concurso.api.models.MockExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MockExamRepository extends JpaRepository<MockExam, UUID> {
    
    List<MockExam> findByUserId(UUID userId);
    
}
