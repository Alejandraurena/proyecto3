package co.edu.sena.web.rest;

import co.edu.sena.domain.Visitante;
import co.edu.sena.repository.VisitanteRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Visitante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VisitanteResource {

    private final Logger log = LoggerFactory.getLogger(VisitanteResource.class);

    private static final String ENTITY_NAME = "visitante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VisitanteRepository visitanteRepository;

    public VisitanteResource(VisitanteRepository visitanteRepository) {
        this.visitanteRepository = visitanteRepository;
    }

    /**
     * {@code POST  /visitantes} : Create a new visitante.
     *
     * @param visitante the visitante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new visitante, or with status {@code 400 (Bad Request)} if the visitante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/visitantes")
    public ResponseEntity<Visitante> createVisitante(@Valid @RequestBody Visitante visitante) throws URISyntaxException {
        log.debug("REST request to save Visitante : {}", visitante);
        if (visitante.getId() != null) {
            throw new BadRequestAlertException("A new visitante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Visitante result = visitanteRepository.save(visitante);
        return ResponseEntity
            .created(new URI("/api/visitantes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /visitantes/:id} : Updates an existing visitante.
     *
     * @param id the id of the visitante to save.
     * @param visitante the visitante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visitante,
     * or with status {@code 400 (Bad Request)} if the visitante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the visitante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/visitantes/{id}")
    public ResponseEntity<Visitante> updateVisitante(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Visitante visitante
    ) throws URISyntaxException {
        log.debug("REST request to update Visitante : {}, {}", id, visitante);
        if (visitante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visitante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visitanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Visitante result = visitanteRepository.save(visitante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visitante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /visitantes/:id} : Partial updates given fields of an existing visitante, field will ignore if it is null
     *
     * @param id the id of the visitante to save.
     * @param visitante the visitante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visitante,
     * or with status {@code 400 (Bad Request)} if the visitante is not valid,
     * or with status {@code 404 (Not Found)} if the visitante is not found,
     * or with status {@code 500 (Internal Server Error)} if the visitante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/visitantes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Visitante> partialUpdateVisitante(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Visitante visitante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Visitante partially : {}, {}", id, visitante);
        if (visitante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visitante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visitanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Visitante> result = visitanteRepository
            .findById(visitante.getId())
            .map(existingVisitante -> {
                if (visitante.getNombrevisitante() != null) {
                    existingVisitante.setNombrevisitante(visitante.getNombrevisitante());
                }
                if (visitante.getApellido() != null) {
                    existingVisitante.setApellido(visitante.getApellido());
                }
                if (visitante.getPhone() != null) {
                    existingVisitante.setPhone(visitante.getPhone());
                }

                return existingVisitante;
            })
            .map(visitanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visitante.getId().toString())
        );
    }

    /**
     * {@code GET  /visitantes} : get all the visitantes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of visitantes in body.
     */
    @GetMapping("/visitantes")
    public List<Visitante> getAllVisitantes() {
        log.debug("REST request to get all Visitantes");
        return visitanteRepository.findAll();
    }

    /**
     * {@code GET  /visitantes/:id} : get the "id" visitante.
     *
     * @param id the id of the visitante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the visitante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/visitantes/{id}")
    public ResponseEntity<Visitante> getVisitante(@PathVariable Long id) {
        log.debug("REST request to get Visitante : {}", id);
        Optional<Visitante> visitante = visitanteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(visitante);
    }

    /**
     * {@code DELETE  /visitantes/:id} : delete the "id" visitante.
     *
     * @param id the id of the visitante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/visitantes/{id}")
    public ResponseEntity<Void> deleteVisitante(@PathVariable Long id) {
        log.debug("REST request to delete Visitante : {}", id);
        visitanteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
