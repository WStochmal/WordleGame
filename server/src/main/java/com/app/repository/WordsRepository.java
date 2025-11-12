package com.app.repository;
import com.app.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WordsRepository extends JpaRepository<Word, UUID> { }
