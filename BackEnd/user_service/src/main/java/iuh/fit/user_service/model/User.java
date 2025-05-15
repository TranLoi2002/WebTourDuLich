package iuh.fit.user_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    @Column(nullable = false, unique = true)
    private String userName;
    @Column(nullable = false)
    private String passWord;

    private String email;
    private String phoneNumber;
    @Column(nullable = false)
    private Boolean isActive = true;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    private Gender gender;

    private Date dateOfBirth;
    @Column(nullable = false)
    private Boolean isVerified = false;
    private String fullName;
    private String address;
    private String avatar;


}