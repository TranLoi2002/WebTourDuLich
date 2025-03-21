package iuh.fit.se.nhom2_webtourdulich_location_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Location")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Location_ID")
    private Long locationId;

    @Column(name = "Location_Name")
    private String locationName;

    @Column(name = "Address")
    private String address;

    @Column(name = "Country")
    private String country;

    @Column(name = "City")
    private String city;

    @Column(name = "Pin_Code")
    private String pinCode;

}
