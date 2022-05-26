package co.edu.sena.repository;

import co.edu.sena.domain.TipoVehiculo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TipoVehiculo entity.
 */
@Repository
public interface TipoVehiculoRepository extends JpaRepository<TipoVehiculo, Long> {
    default Optional<TipoVehiculo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TipoVehiculo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TipoVehiculo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct tipoVehiculo from TipoVehiculo tipoVehiculo left join fetch tipoVehiculo.facturacion",
        countQuery = "select count(distinct tipoVehiculo) from TipoVehiculo tipoVehiculo"
    )
    Page<TipoVehiculo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct tipoVehiculo from TipoVehiculo tipoVehiculo left join fetch tipoVehiculo.facturacion")
    List<TipoVehiculo> findAllWithToOneRelationships();

    @Query("select tipoVehiculo from TipoVehiculo tipoVehiculo left join fetch tipoVehiculo.facturacion where tipoVehiculo.id =:id")
    Optional<TipoVehiculo> findOneWithToOneRelationships(@Param("id") Long id);
}
