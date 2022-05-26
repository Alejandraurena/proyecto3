package co.edu.sena.repository;

import co.edu.sena.domain.Vehiculo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Vehiculo entity.
 */
@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    default Optional<Vehiculo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Vehiculo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Vehiculo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct vehiculo from Vehiculo vehiculo left join fetch vehiculo.tipoVehiculo",
        countQuery = "select count(distinct vehiculo) from Vehiculo vehiculo"
    )
    Page<Vehiculo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct vehiculo from Vehiculo vehiculo left join fetch vehiculo.tipoVehiculo")
    List<Vehiculo> findAllWithToOneRelationships();

    @Query("select vehiculo from Vehiculo vehiculo left join fetch vehiculo.tipoVehiculo where vehiculo.id =:id")
    Optional<Vehiculo> findOneWithToOneRelationships(@Param("id") Long id);
}
