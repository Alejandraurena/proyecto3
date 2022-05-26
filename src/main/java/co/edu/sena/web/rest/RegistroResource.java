package co.edu.sena.web.rest;

import co.edu.sena.domain.Registro;
import co.edu.sena.repository.RegistroRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Registro}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RegistroResource {

    private final Logger log = LoggerFactory.getLogger(RegistroResource.class);

    private static final String ENTITY_NAME = "registro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistroRepository registroRepository;

    public RegistroResource(RegistroRepository registroRepository) {
        this.registroRepository = registroRepository;
    }

    /**
     * {@code POST  /registros} : Create a new registro.
     *
     * @param registro the registro to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registro, or with status {@code 400 (Bad Request)} if the registro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/registros")
    public ResponseEntity<Registro> createRegistro(@Valid @RequestBody Registro registro) throws URISyntaxException {
        log.debug("REST request to save Registro : {}", registro);
        if (registro.getId() != null) {
            throw new BadRequestAlertException("A new registro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Registro result = registroRepository.save(registro);
        return ResponseEntity
            .created(new URI("/api/registros/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /registros/:id} : Updates an existing registro.
     *
     * @param id the id of the registro to save.
     * @param registro the registro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registro,
     * or with status {@code 400 (Bad Request)} if the registro is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/registros/{id}")
    public ResponseEntity<Registro> updateRegistro(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Registro registro
    ) throws URISyntaxException {
        log.debug("REST request to update Registro : {}, {}", id, registro);
        if (registro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Registro result = registroRepository.save(registro);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registro.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /registros/:id} : Partial updates given fields of an existing registro, field will ignore if it is null
     *
     * @param id the id of the registro to save.
     * @param registro the registro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registro,
     * or with status {@code 400 (Bad Request)} if the registro is not valid,
     * or with status {@code 404 (Not Found)} if the registro is not found,
     * or with status {@code 500 (Internal Server Error)} if the registro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/registros/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Registro> partialUpdateRegistro(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Registro registro
    ) throws URISyntaxException {
        log.debug("REST request to partial update Registro partially : {}, {}", id, registro);
        if (registro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Registro> result = registroRepository
            .findById(registro.getId())
            .map(existingRegistro -> {
                if (registro.getHoraIngreso() != null) {
                    existingRegistro.setHoraIngreso(registro.getHoraIngreso());
                }
                if (registro.getHoraSalida() != null) {
                    existingRegistro.setHoraSalida(registro.getHoraSalida());
                }

                return existingRegistro;
            })
            .map(registroRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registro.getId().toString())
        );
    }

    /**
     * {@code GET  /registros} : get all the registros.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registros in body.
     */
    @GetMapping("/registros")
    public List<Registro> getAllRegistros(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Registros");
        return registroRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /registros/:id} : get the "id" registro.
     *
     * @param id the id of the registro to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registro, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/registros/{id}")
    public ResponseEntity<Registro> getRegistro(@PathVariable Long id) {
        log.debug("REST request to get Registro : {}", id);
        Optional<Registro> registro = registroRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(registro);
    }

    /**
     * {@code DELETE  /registros/:id} : delete the "id" registro.
     *
     * @param id the id of the registro to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/registros/{id}")
    public ResponseEntity<Void> deleteRegistro(@PathVariable Long id) {
        log.debug("REST request to delete Registro : {}", id);
        registroRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
