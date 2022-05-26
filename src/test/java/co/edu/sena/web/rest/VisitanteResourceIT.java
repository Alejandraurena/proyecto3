package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Visitante;
import co.edu.sena.repository.VisitanteRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VisitanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VisitanteResourceIT {

    private static final String DEFAULT_NOMBREVISITANTE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBREVISITANTE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDO = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDO = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/visitantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVisitanteMockMvc;

    private Visitante visitante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visitante createEntity(EntityManager em) {
        Visitante visitante = new Visitante().nombrevisitante(DEFAULT_NOMBREVISITANTE).apellido(DEFAULT_APELLIDO).phone(DEFAULT_PHONE);
        return visitante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visitante createUpdatedEntity(EntityManager em) {
        Visitante visitante = new Visitante().nombrevisitante(UPDATED_NOMBREVISITANTE).apellido(UPDATED_APELLIDO).phone(UPDATED_PHONE);
        return visitante;
    }

    @BeforeEach
    public void initTest() {
        visitante = createEntity(em);
    }

    @Test
    @Transactional
    void createVisitante() throws Exception {
        int databaseSizeBeforeCreate = visitanteRepository.findAll().size();
        // Create the Visitante
        restVisitanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitante)))
            .andExpect(status().isCreated());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeCreate + 1);
        Visitante testVisitante = visitanteList.get(visitanteList.size() - 1);
        assertThat(testVisitante.getNombrevisitante()).isEqualTo(DEFAULT_NOMBREVISITANTE);
        assertThat(testVisitante.getApellido()).isEqualTo(DEFAULT_APELLIDO);
        assertThat(testVisitante.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void createVisitanteWithExistingId() throws Exception {
        // Create the Visitante with an existing ID
        visitante.setId(1L);

        int databaseSizeBeforeCreate = visitanteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVisitanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitante)))
            .andExpect(status().isBadRequest());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombrevisitanteIsRequired() throws Exception {
        int databaseSizeBeforeTest = visitanteRepository.findAll().size();
        // set the field null
        visitante.setNombrevisitante(null);

        // Create the Visitante, which fails.

        restVisitanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitante)))
            .andExpect(status().isBadRequest());

        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = visitanteRepository.findAll().size();
        // set the field null
        visitante.setPhone(null);

        // Create the Visitante, which fails.

        restVisitanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitante)))
            .andExpect(status().isBadRequest());

        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVisitantes() throws Exception {
        // Initialize the database
        visitanteRepository.saveAndFlush(visitante);

        // Get all the visitanteList
        restVisitanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visitante.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombrevisitante").value(hasItem(DEFAULT_NOMBREVISITANTE)))
            .andExpect(jsonPath("$.[*].apellido").value(hasItem(DEFAULT_APELLIDO)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }

    @Test
    @Transactional
    void getVisitante() throws Exception {
        // Initialize the database
        visitanteRepository.saveAndFlush(visitante);

        // Get the visitante
        restVisitanteMockMvc
            .perform(get(ENTITY_API_URL_ID, visitante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(visitante.getId().intValue()))
            .andExpect(jsonPath("$.nombrevisitante").value(DEFAULT_NOMBREVISITANTE))
            .andExpect(jsonPath("$.apellido").value(DEFAULT_APELLIDO))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingVisitante() throws Exception {
        // Get the visitante
        restVisitanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVisitante() throws Exception {
        // Initialize the database
        visitanteRepository.saveAndFlush(visitante);

        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();

        // Update the visitante
        Visitante updatedVisitante = visitanteRepository.findById(visitante.getId()).get();
        // Disconnect from session so that the updates on updatedVisitante are not directly saved in db
        em.detach(updatedVisitante);
        updatedVisitante.nombrevisitante(UPDATED_NOMBREVISITANTE).apellido(UPDATED_APELLIDO).phone(UPDATED_PHONE);

        restVisitanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVisitante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVisitante))
            )
            .andExpect(status().isOk());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
        Visitante testVisitante = visitanteList.get(visitanteList.size() - 1);
        assertThat(testVisitante.getNombrevisitante()).isEqualTo(UPDATED_NOMBREVISITANTE);
        assertThat(testVisitante.getApellido()).isEqualTo(UPDATED_APELLIDO);
        assertThat(testVisitante.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingVisitante() throws Exception {
        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();
        visitante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisitanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visitante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVisitante() throws Exception {
        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();
        visitante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVisitante() throws Exception {
        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();
        visitante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visitante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVisitanteWithPatch() throws Exception {
        // Initialize the database
        visitanteRepository.saveAndFlush(visitante);

        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();

        // Update the visitante using partial update
        Visitante partialUpdatedVisitante = new Visitante();
        partialUpdatedVisitante.setId(visitante.getId());

        partialUpdatedVisitante.phone(UPDATED_PHONE);

        restVisitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisitante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisitante))
            )
            .andExpect(status().isOk());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
        Visitante testVisitante = visitanteList.get(visitanteList.size() - 1);
        assertThat(testVisitante.getNombrevisitante()).isEqualTo(DEFAULT_NOMBREVISITANTE);
        assertThat(testVisitante.getApellido()).isEqualTo(DEFAULT_APELLIDO);
        assertThat(testVisitante.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void fullUpdateVisitanteWithPatch() throws Exception {
        // Initialize the database
        visitanteRepository.saveAndFlush(visitante);

        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();

        // Update the visitante using partial update
        Visitante partialUpdatedVisitante = new Visitante();
        partialUpdatedVisitante.setId(visitante.getId());

        partialUpdatedVisitante.nombrevisitante(UPDATED_NOMBREVISITANTE).apellido(UPDATED_APELLIDO).phone(UPDATED_PHONE);

        restVisitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisitante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisitante))
            )
            .andExpect(status().isOk());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
        Visitante testVisitante = visitanteList.get(visitanteList.size() - 1);
        assertThat(testVisitante.getNombrevisitante()).isEqualTo(UPDATED_NOMBREVISITANTE);
        assertThat(testVisitante.getApellido()).isEqualTo(UPDATED_APELLIDO);
        assertThat(testVisitante.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingVisitante() throws Exception {
        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();
        visitante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, visitante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVisitante() throws Exception {
        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();
        visitante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVisitante() throws Exception {
        int databaseSizeBeforeUpdate = visitanteRepository.findAll().size();
        visitante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisitanteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(visitante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visitante in the database
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVisitante() throws Exception {
        // Initialize the database
        visitanteRepository.saveAndFlush(visitante);

        int databaseSizeBeforeDelete = visitanteRepository.findAll().size();

        // Delete the visitante
        restVisitanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, visitante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Visitante> visitanteList = visitanteRepository.findAll();
        assertThat(visitanteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
