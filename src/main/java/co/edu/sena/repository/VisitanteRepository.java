package co.edu.sena.repository;

import co.edu.sena.domain.Visitante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Visitante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VisitanteRepository extends JpaRepository<Visitante, Long> {}
