/*
 * @ (#) RèundClient.java 1.0 4/26/2025
 *
 * Copyright (c) 2025 IUH.All rights reserved
 */
package iuh.fit.booking_service.client.payment;

import iuh.fit.booking_service.dto.RefundDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/*
 * @description
 * @author : Nguyen Truong An
 * @date : 4/26/2025
 * @version 1.0
 */
@FeignClient(name = "REFUND-SERVICE", path = "/payment/refunds")
public interface RefundClient {
    @PostMapping
    void createRefund(@RequestBody RefundDTO refundDTO);
}
