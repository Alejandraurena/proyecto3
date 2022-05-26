package co.edu.sena.repository;

import co.edu.sena.domain.Facturacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Facturacion entity.
 */
@Repository
public interface FacturacionRepository extends JpaRepository<Facturacion, Long> {
    default Optional<Facturacion> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Facturacion> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Facturacion> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct facturacion from Facturacion facturacion left join fetch facturacion.formaDepago",
        countQuery = "select count(distinct facturacion) from Facturacion facturacion"
    )
    Page<Facturacion> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct facturacion from Facturacion facturacion left join fetch facturacion.formaDepago")
    List<Facturacion> findAllWithToOneRelationships();

    @Query("select facturacion from Facturacion facturacion left join fetch facturacion.formaDepago where facturacion.id =:id")
    Optional<Facturacion> findOneWithToOneRelationships(@Param("id") Long id);
}
