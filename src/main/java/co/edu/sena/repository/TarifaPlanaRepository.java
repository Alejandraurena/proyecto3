package co.edu.sena.repository;

import co.edu.sena.domain.TarifaPlana;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TarifaPlana entity.
 */
@Repository
public interface TarifaPlanaRepository extends JpaRepository<TarifaPlana, Long> {
    default Optional<TarifaPlana> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TarifaPlana> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TarifaPlana> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct tarifaPlana from TarifaPlana tarifaPlana left join fetch tarifaPlana.facturacion left join fetch tarifaPlana.cliente",
        countQuery = "select count(distinct tarifaPlana) from TarifaPlana tarifaPlana"
    )
    Page<TarifaPlana> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct tarifaPlana from TarifaPlana tarifaPlana left join fetch tarifaPlana.facturacion left join fetch tarifaPlana.cliente"
    )
    List<TarifaPlana> findAllWithToOneRelationships();

    @Query(
        "select tarifaPlana from TarifaPlana tarifaPlana left join fetch tarifaPlana.facturacion left join fetch tarifaPlana.cliente where tarifaPlana.id =:id"
    )
    Optional<TarifaPlana> findOneWithToOneRelationships(@Param("id") Long id);
}
