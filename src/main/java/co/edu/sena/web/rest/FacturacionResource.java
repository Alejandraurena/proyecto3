package co.edu.sena.web.rest;

import co.edu.sena.domain.Facturacion;
import co.edu.sena.repository.FacturacionRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Facturacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FacturacionResource {

    private final Logger log = LoggerFactory.getLogger(FacturacionResource.class);

    private static final String ENTITY_NAME = "facturacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FacturacionRepository facturacionRepository;

    public FacturacionResource(FacturacionRepository facturacionRepository) {
        this.facturacionRepository = facturacionRepository;
    }

    /**
     * {@code POST  /facturacions} : Create a new facturacion.
     *
     * @param facturacion the facturacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new facturacion, or with status {@code 400 (Bad Request)} if the facturacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/facturacions")
    public ResponseEntity<Facturacion> createFacturacion(@Valid @RequestBody Facturacion facturacion) throws URISyntaxException {
        log.debug("REST request to save Facturacion : {}", facturacion);
        if (facturacion.getId() != null) {
            throw new BadRequestAlertException("A new facturacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Facturacion result = facturacionRepository.save(facturacion);
        return ResponseEntity
            .created(new URI("/api/facturacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /facturacions/:id} : Updates an existing facturacion.
     *
     * @param id the id of the facturacion to save.
     * @param facturacion the facturacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated facturacion,
     * or with status {@code 400 (Bad Request)} if the facturacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the facturacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/facturacions/{id}")
    public ResponseEntity<Facturacion> updateFacturacion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Facturacion facturacion
    ) throws URISyntaxException {
        log.debug("REST request to update Facturacion : {}, {}", id, facturacion);
        if (facturacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, facturacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!facturacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Facturacion result = facturacionRepository.save(facturacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, facturacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /facturacions/:id} : Partial updates given fields of an existing facturacion, field will ignore if it is null
     *
     * @param id the id of the facturacion to save.
     * @param facturacion the facturacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated facturacion,
     * or with status {@code 400 (Bad Request)} if the facturacion is not valid,
     * or with status {@code 404 (Not Found)} if the facturacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the facturacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/facturacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Facturacion> partialUpdateFacturacion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Facturacion facturacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Facturacion partially : {}, {}", id, facturacion);
        if (facturacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, facturacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!facturacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Facturacion> result = facturacionRepository
            .findById(facturacion.getId())
            .map(existingFacturacion -> {
                if (facturacion.getFechaFactura() != null) {
                    existingFacturacion.setFechaFactura(facturacion.getFechaFactura());
                }
                if (facturacion.getValorFactura() != null) {
                    existingFacturacion.setValorFactura(facturacion.getValorFactura());
                }

                return existingFacturacion;
            })
            .map(facturacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, facturacion.getId().toString())
        );
    }

    /**
     * {@code GET  /facturacions} : get all the facturacions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of facturacions in body.
     */
    @GetMapping("/facturacions")
    public List<Facturacion> getAllFacturacions(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Facturacions");
        return facturacionRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /facturacions/:id} : get the "id" facturacion.
     *
     * @param id the id of the facturacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the facturacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/facturacions/{id}")
    public ResponseEntity<Facturacion> getFacturacion(@PathVariable Long id) {
        log.debug("REST request to get Facturacion : {}", id);
        Optional<Facturacion> facturacion = facturacionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(facturacion);
    }

    /**
     * {@code DELETE  /facturacions/:id} : delete the "id" facturacion.
     *
     * @param id the id of the facturacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/facturacions/{id}")
    public ResponseEntity<Void> deleteFacturacion(@PathVariable Long id) {
        log.debug("REST request to delete Facturacion : {}", id);
        facturacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
