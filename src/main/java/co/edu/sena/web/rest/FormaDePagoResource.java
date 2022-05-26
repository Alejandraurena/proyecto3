package co.edu.sena.web.rest;

import co.edu.sena.domain.FormaDePago;
import co.edu.sena.repository.FormaDePagoRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.FormaDePago}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormaDePagoResource {

    private final Logger log = LoggerFactory.getLogger(FormaDePagoResource.class);

    private static final String ENTITY_NAME = "formaDePago";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormaDePagoRepository formaDePagoRepository;

    public FormaDePagoResource(FormaDePagoRepository formaDePagoRepository) {
        this.formaDePagoRepository = formaDePagoRepository;
    }

    /**
     * {@code POST  /forma-de-pagos} : Create a new formaDePago.
     *
     * @param formaDePago the formaDePago to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formaDePago, or with status {@code 400 (Bad Request)} if the formaDePago has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/forma-de-pagos")
    public ResponseEntity<FormaDePago> createFormaDePago(@Valid @RequestBody FormaDePago formaDePago) throws URISyntaxException {
        log.debug("REST request to save FormaDePago : {}", formaDePago);
        if (formaDePago.getId() != null) {
            throw new BadRequestAlertException("A new formaDePago cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormaDePago result = formaDePagoRepository.save(formaDePago);
        return ResponseEntity
            .created(new URI("/api/forma-de-pagos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /forma-de-pagos/:id} : Updates an existing formaDePago.
     *
     * @param id the id of the formaDePago to save.
     * @param formaDePago the formaDePago to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formaDePago,
     * or with status {@code 400 (Bad Request)} if the formaDePago is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formaDePago couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/forma-de-pagos/{id}")
    public ResponseEntity<FormaDePago> updateFormaDePago(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FormaDePago formaDePago
    ) throws URISyntaxException {
        log.debug("REST request to update FormaDePago : {}, {}", id, formaDePago);
        if (formaDePago.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formaDePago.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formaDePagoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormaDePago result = formaDePagoRepository.save(formaDePago);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formaDePago.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /forma-de-pagos/:id} : Partial updates given fields of an existing formaDePago, field will ignore if it is null
     *
     * @param id the id of the formaDePago to save.
     * @param formaDePago the formaDePago to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formaDePago,
     * or with status {@code 400 (Bad Request)} if the formaDePago is not valid,
     * or with status {@code 404 (Not Found)} if the formaDePago is not found,
     * or with status {@code 500 (Internal Server Error)} if the formaDePago couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/forma-de-pagos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormaDePago> partialUpdateFormaDePago(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FormaDePago formaDePago
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormaDePago partially : {}, {}", id, formaDePago);
        if (formaDePago.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formaDePago.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formaDePagoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormaDePago> result = formaDePagoRepository
            .findById(formaDePago.getId())
            .map(existingFormaDePago -> {
                if (formaDePago.getFormaPago() != null) {
                    existingFormaDePago.setFormaPago(formaDePago.getFormaPago());
                }

                return existingFormaDePago;
            })
            .map(formaDePagoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formaDePago.getId().toString())
        );
    }

    /**
     * {@code GET  /forma-de-pagos} : get all the formaDePagos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formaDePagos in body.
     */
    @GetMapping("/forma-de-pagos")
    public List<FormaDePago> getAllFormaDePagos() {
        log.debug("REST request to get all FormaDePagos");
        return formaDePagoRepository.findAll();
    }

    /**
     * {@code GET  /forma-de-pagos/:id} : get the "id" formaDePago.
     *
     * @param id the id of the formaDePago to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formaDePago, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/forma-de-pagos/{id}")
    public ResponseEntity<FormaDePago> getFormaDePago(@PathVariable Long id) {
        log.debug("REST request to get FormaDePago : {}", id);
        Optional<FormaDePago> formaDePago = formaDePagoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formaDePago);
    }

    /**
     * {@code DELETE  /forma-de-pagos/:id} : delete the "id" formaDePago.
     *
     * @param id the id of the formaDePago to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/forma-de-pagos/{id}")
    public ResponseEntity<Void> deleteFormaDePago(@PathVariable Long id) {
        log.debug("REST request to delete FormaDePago : {}", id);
        formaDePagoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
