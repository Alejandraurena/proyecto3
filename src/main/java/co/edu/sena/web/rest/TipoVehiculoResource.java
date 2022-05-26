package co.edu.sena.web.rest;

import co.edu.sena.domain.TipoVehiculo;
import co.edu.sena.repository.TipoVehiculoRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.edu.sena.domain.TipoVehiculo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TipoVehiculoResource {

    private final Logger log = LoggerFactory.getLogger(TipoVehiculoResource.class);

    private static final String ENTITY_NAME = "tipoVehiculo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TipoVehiculoRepository tipoVehiculoRepository;

    public TipoVehiculoResource(TipoVehiculoRepository tipoVehiculoRepository) {
        this.tipoVehiculoRepository = tipoVehiculoRepository;
    }

    /**
     * {@code POST  /tipo-vehiculos} : Create a new tipoVehiculo.
     *
     * @param tipoVehiculo the tipoVehiculo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tipoVehiculo, or with status {@code 400 (Bad Request)} if the tipoVehiculo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tipo-vehiculos")
    public ResponseEntity<TipoVehiculo> createTipoVehiculo(@Valid @RequestBody TipoVehiculo tipoVehiculo) throws URISyntaxException {
        log.debug("REST request to save TipoVehiculo : {}", tipoVehiculo);
        if (tipoVehiculo.getId() != null) {
            throw new BadRequestAlertException("A new tipoVehiculo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TipoVehiculo result = tipoVehiculoRepository.save(tipoVehiculo);
        return ResponseEntity
            .created(new URI("/api/tipo-vehiculos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tipo-vehiculos/:id} : Updates an existing tipoVehiculo.
     *
     * @param id the id of the tipoVehiculo to save.
     * @param tipoVehiculo the tipoVehiculo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoVehiculo,
     * or with status {@code 400 (Bad Request)} if the tipoVehiculo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tipoVehiculo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tipo-vehiculos/{id}")
    public ResponseEntity<TipoVehiculo> updateTipoVehiculo(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TipoVehiculo tipoVehiculo
    ) throws URISyntaxException {
        log.debug("REST request to update TipoVehiculo : {}, {}", id, tipoVehiculo);
        if (tipoVehiculo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoVehiculo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoVehiculoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TipoVehiculo result = tipoVehiculoRepository.save(tipoVehiculo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoVehiculo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tipo-vehiculos/:id} : Partial updates given fields of an existing tipoVehiculo, field will ignore if it is null
     *
     * @param id the id of the tipoVehiculo to save.
     * @param tipoVehiculo the tipoVehiculo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipoVehiculo,
     * or with status {@code 400 (Bad Request)} if the tipoVehiculo is not valid,
     * or with status {@code 404 (Not Found)} if the tipoVehiculo is not found,
     * or with status {@code 500 (Internal Server Error)} if the tipoVehiculo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tipo-vehiculos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TipoVehiculo> partialUpdateTipoVehiculo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TipoVehiculo tipoVehiculo
    ) throws URISyntaxException {
        log.debug("REST request to partial update TipoVehiculo partially : {}, {}", id, tipoVehiculo);
        if (tipoVehiculo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tipoVehiculo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tipoVehiculoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TipoVehiculo> result = tipoVehiculoRepository
            .findById(tipoVehiculo.getId())
            .map(existingTipoVehiculo -> {
                if (tipoVehiculo.getTipoVehiculo() != null) {
                    existingTipoVehiculo.setTipoVehiculo(tipoVehiculo.getTipoVehiculo());
                }
                if (tipoVehiculo.getMarcaVehiculo() != null) {
                    existingTipoVehiculo.setMarcaVehiculo(tipoVehiculo.getMarcaVehiculo());
                }

                return existingTipoVehiculo;
            })
            .map(tipoVehiculoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipoVehiculo.getId().toString())
        );
    }

    /**
     * {@code GET  /tipo-vehiculos} : get all the tipoVehiculos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tipoVehiculos in body.
     */
    @GetMapping("/tipo-vehiculos")
    public List<TipoVehiculo> getAllTipoVehiculos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TipoVehiculos");
        return tipoVehiculoRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /tipo-vehiculos/:id} : get the "id" tipoVehiculo.
     *
     * @param id the id of the tipoVehiculo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tipoVehiculo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tipo-vehiculos/{id}")
    public ResponseEntity<TipoVehiculo> getTipoVehiculo(@PathVariable Long id) {
        log.debug("REST request to get TipoVehiculo : {}", id);
        Optional<TipoVehiculo> tipoVehiculo = tipoVehiculoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(tipoVehiculo);
    }

    /**
     * {@code DELETE  /tipo-vehiculos/:id} : delete the "id" tipoVehiculo.
     *
     * @param id the id of the tipoVehiculo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tipo-vehiculos/{id}")
    public ResponseEntity<Void> deleteTipoVehiculo(@PathVariable Long id) {
        log.debug("REST request to delete TipoVehiculo : {}", id);
        tipoVehiculoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
