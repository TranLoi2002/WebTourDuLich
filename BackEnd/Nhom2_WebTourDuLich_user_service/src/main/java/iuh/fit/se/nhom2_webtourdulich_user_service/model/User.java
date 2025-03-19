package iuh.fit.se.nhom2_webtourdulich_user_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name= "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_ID")
    private long id;

    @Column(name = "UserName", nullable = false, unique = true)
    private String userName;
    @Column(name = "Password", nullable = false)
    private String password;

    @Column(name = "Email", nullable = false, unique = true)
    private String email;
    @Column(name = "Name", nullable = false)
    private String name;
    @Column(name = "Phone", nullable = false, unique = true)
    private String phone;
    @Column(name = "Is_Active", nullable = false)
    private Boolean isActive;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "Create_At", nullable = false, updatable = false)
    private Date createAt;

    protected void onCreate() {
        createAt = new Date(); // gán thời gian hiện tại khi tạo user mới
    }
}
