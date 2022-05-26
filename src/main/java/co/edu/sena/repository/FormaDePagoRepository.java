package co.edu.sena.repository;

import co.edu.sena.domain.FormaDePago;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FormaDePago entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormaDePagoRepository extends JpaRepository<FormaDePago, Long> {}
