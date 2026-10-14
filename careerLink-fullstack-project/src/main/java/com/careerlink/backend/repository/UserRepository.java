package com.careerlink.backend.repository;

import com.careerlink.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Email is a multivalued attribute (user_emails table), so we join the collection.
    @Query("select u from User u join u.emails e where lower(e) = lower(:email)")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("select count(u) from User u join u.emails e where lower(e) = lower(:email)")
    long countByEmail(@Param("email") String email);

    default boolean existsByEmail(String email) {
        return countByEmail(email) > 0;
    }
}
