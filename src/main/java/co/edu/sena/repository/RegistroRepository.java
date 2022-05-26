package co.edu.sena.repository;

import co.edu.sena.domain.Registro;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Registro entity.
 */
@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {
    default Optional<Registro> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Registro> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Registro> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct registro from Registro registro left join fetch registro.vehiculo",
        countQuery = "select count(distinct registro) from Registro registro"
    )
    Page<Registro> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct registro from Registro registro left join fetch registro.vehiculo")
    List<Registro> findAllWithToOneRelationships();

    @Query("select registro from Registro registro left join fetch registro.vehiculo where registro.id =:id")
    Optional<Registro> findOneWithToOneRelationships(@Param("id") Long id);
}
