package co.edu.sena.web.rest;

import co.edu.sena.domain.TarifaPlana;
import co.edu.sena.repository.TarifaPlanaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.TarifaPlana}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TarifaPlanaResource {

    private final Logger log = LoggerFactory.getLogger(TarifaPlanaResource.class);

    private static final String ENTITY_NAME = "tarifaPlana";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TarifaPlanaRepository tarifaPlanaRepository;

    public TarifaPlanaResource(TarifaPlanaRepository tarifaPlanaRepository) {
        this.tarifaPlanaRepository = tarifaPlanaRepository;
    }

    /**
     * {@code POST  /tarifa-planas} : Create a new tarifaPlana.
     *
     * @param tarifaPlana the tarifaPlana to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tarifaPlana, or with status {@code 400 (Bad Request)} if the tarifaPlana has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tarifa-planas")
    public ResponseEntity<TarifaPlana> createTarifaPlana(@Valid @RequestBody TarifaPlana tarifaPlana) throws URISyntaxException {
        log.debug("REST request to save TarifaPlana : {}", tarifaPlana);
        if (tarifaPlana.getId() != null) {
            throw new BadRequestAlertException("A new tarifaPlana cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TarifaPlana result = tarifaPlanaRepository.save(tarifaPlana);
        return ResponseEntity
            .created(new URI("/api/tarifa-planas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tarifa-planas/:id} : Updates an existing tarifaPlana.
     *
     * @param id the id of the tarifaPlana to save.
     * @param tarifaPlana the tarifaPlana to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tarifaPlana,
     * or with status {@code 400 (Bad Request)} if the tarifaPlana is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tarifaPlana couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tarifa-planas/{id}")
    public ResponseEntity<TarifaPlana> updateTarifaPlana(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TarifaPlana tarifaPlana
    ) throws URISyntaxException {
        log.debug("REST request to update TarifaPlana : {}, {}", id, tarifaPlana);
        if (tarifaPlana.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tarifaPlana.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tarifaPlanaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TarifaPlana result = tarifaPlanaRepository.save(tarifaPlana);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tarifaPlana.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tarifa-planas/:id} : Partial updates given fields of an existing tarifaPlana, field will ignore if it is null
     *
     * @param id the id of the tarifaPlana to save.
     * @param tarifaPlana the tarifaPlana to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tarifaPlana,
     * or with status {@code 400 (Bad Request)} if the tarifaPlana is not valid,
     * or with status {@code 404 (Not Found)} if the tarifaPlana is not found,
     * or with status {@code 500 (Internal Server Error)} if the tarifaPlana couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tarifa-planas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TarifaPlana> partialUpdateTarifaPlana(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TarifaPlana tarifaPlana
    ) throws URISyntaxException {
        log.debug("REST request to partial update TarifaPlana partially : {}, {}", id, tarifaPlana);
        if (tarifaPlana.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tarifaPlana.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tarifaPlanaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TarifaPlana> result = tarifaPlanaRepository
            .findById(tarifaPlana.getId())
            .map(existingTarifaPlana -> {
                if (tarifaPlana.getValor() != null) {
                    existingTarifaPlana.setValor(tarifaPlana.getValor());
                }
                if (tarifaPlana.getFechaPago() != null) {
                    existingTarifaPlana.setFechaPago(tarifaPlana.getFechaPago());
                }

                return existingTarifaPlana;
            })
            .map(tarifaPlanaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tarifaPlana.getId().toString())
        );
    }

    /**
     * {@code GET  /tarifa-planas} : get all the tarifaPlanas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tarifaPlanas in body.
     */
    @GetMapping("/tarifa-planas")
    public List<TarifaPlana> getAllTarifaPlanas(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TarifaPlanas");
        return tarifaPlanaRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /tarifa-planas/:id} : get the "id" tarifaPlana.
     *
     * @param id the id of the tarifaPlana to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tarifaPlana, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tarifa-planas/{id}")
    public ResponseEntity<TarifaPlana> getTarifaPlana(@PathVariable Long id) {
        log.debug("REST request to get TarifaPlana : {}", id);
        Optional<TarifaPlana> tarifaPlana = tarifaPlanaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(tarifaPlana);
    }

    /**
     * {@code DELETE  /tarifa-planas/:id} : delete the "id" tarifaPlana.
     *
     * @param id the id of the tarifaPlana to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tarifa-planas/{id}")
    public ResponseEntity<Void> deleteTarifaPlana(@PathVariable Long id) {
        log.debug("REST request to delete TarifaPlana : {}", id);
        tarifaPlanaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
