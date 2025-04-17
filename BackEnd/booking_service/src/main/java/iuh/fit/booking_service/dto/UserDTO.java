/*
 * @ (#) UserDTO.java 1.0 4/15/2025
 *
 * Copyright (c) 2025 IUH.All rights reserved
 */

package iuh.fit.booking_service.dto;

import lombok.Data;

/*
 * @description
 * @author : Nguyen Truong An
 * @date : 4/15/2025
 * @version 1.0
 */
@Data
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String userName;
}
