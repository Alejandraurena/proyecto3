package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.FormaDePago;
import co.edu.sena.repository.FormaDePagoRepository;
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
 * Integration tests for the {@link FormaDePagoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormaDePagoResourceIT {

    private static final String DEFAULT_FORMA_PAGO = "AAAAAAAAAA";
    private static final String UPDATED_FORMA_PAGO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/forma-de-pagos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormaDePagoRepository formaDePagoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormaDePagoMockMvc;

    private FormaDePago formaDePago;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormaDePago createEntity(EntityManager em) {
        FormaDePago formaDePago = new FormaDePago().formaPago(DEFAULT_FORMA_PAGO);
        return formaDePago;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormaDePago createUpdatedEntity(EntityManager em) {
        FormaDePago formaDePago = new FormaDePago().formaPago(UPDATED_FORMA_PAGO);
        return formaDePago;
    }

    @BeforeEach
    public void initTest() {
        formaDePago = createEntity(em);
    }

    @Test
    @Transactional
    void createFormaDePago() throws Exception {
        int databaseSizeBeforeCreate = formaDePagoRepository.findAll().size();
        // Create the FormaDePago
        restFormaDePagoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formaDePago)))
            .andExpect(status().isCreated());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeCreate + 1);
        FormaDePago testFormaDePago = formaDePagoList.get(formaDePagoList.size() - 1);
        assertThat(testFormaDePago.getFormaPago()).isEqualTo(DEFAULT_FORMA_PAGO);
    }

    @Test
    @Transactional
    void createFormaDePagoWithExistingId() throws Exception {
        // Create the FormaDePago with an existing ID
        formaDePago.setId(1L);

        int databaseSizeBeforeCreate = formaDePagoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormaDePagoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formaDePago)))
            .andExpect(status().isBadRequest());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFormaPagoIsRequired() throws Exception {
        int databaseSizeBeforeTest = formaDePagoRepository.findAll().size();
        // set the field null
        formaDePago.setFormaPago(null);

        // Create the FormaDePago, which fails.

        restFormaDePagoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formaDePago)))
            .andExpect(status().isBadRequest());

        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFormaDePagos() throws Exception {
        // Initialize the database
        formaDePagoRepository.saveAndFlush(formaDePago);

        // Get all the formaDePagoList
        restFormaDePagoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formaDePago.getId().intValue())))
            .andExpect(jsonPath("$.[*].formaPago").value(hasItem(DEFAULT_FORMA_PAGO)));
    }

    @Test
    @Transactional
    void getFormaDePago() throws Exception {
        // Initialize the database
        formaDePagoRepository.saveAndFlush(formaDePago);

        // Get the formaDePago
        restFormaDePagoMockMvc
            .perform(get(ENTITY_API_URL_ID, formaDePago.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formaDePago.getId().intValue()))
            .andExpect(jsonPath("$.formaPago").value(DEFAULT_FORMA_PAGO));
    }

    @Test
    @Transactional
    void getNonExistingFormaDePago() throws Exception {
        // Get the formaDePago
        restFormaDePagoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormaDePago() throws Exception {
        // Initialize the database
        formaDePagoRepository.saveAndFlush(formaDePago);

        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();

        // Update the formaDePago
        FormaDePago updatedFormaDePago = formaDePagoRepository.findById(formaDePago.getId()).get();
        // Disconnect from session so that the updates on updatedFormaDePago are not directly saved in db
        em.detach(updatedFormaDePago);
        updatedFormaDePago.formaPago(UPDATED_FORMA_PAGO);

        restFormaDePagoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormaDePago.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormaDePago))
            )
            .andExpect(status().isOk());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
        FormaDePago testFormaDePago = formaDePagoList.get(formaDePagoList.size() - 1);
        assertThat(testFormaDePago.getFormaPago()).isEqualTo(UPDATED_FORMA_PAGO);
    }

    @Test
    @Transactional
    void putNonExistingFormaDePago() throws Exception {
        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();
        formaDePago.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormaDePagoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formaDePago.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formaDePago))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormaDePago() throws Exception {
        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();
        formaDePago.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormaDePagoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formaDePago))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormaDePago() throws Exception {
        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();
        formaDePago.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormaDePagoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formaDePago)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormaDePagoWithPatch() throws Exception {
        // Initialize the database
        formaDePagoRepository.saveAndFlush(formaDePago);

        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();

        // Update the formaDePago using partial update
        FormaDePago partialUpdatedFormaDePago = new FormaDePago();
        partialUpdatedFormaDePago.setId(formaDePago.getId());

        partialUpdatedFormaDePago.formaPago(UPDATED_FORMA_PAGO);

        restFormaDePagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormaDePago.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormaDePago))
            )
            .andExpect(status().isOk());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
        FormaDePago testFormaDePago = formaDePagoList.get(formaDePagoList.size() - 1);
        assertThat(testFormaDePago.getFormaPago()).isEqualTo(UPDATED_FORMA_PAGO);
    }

    @Test
    @Transactional
    void fullUpdateFormaDePagoWithPatch() throws Exception {
        // Initialize the database
        formaDePagoRepository.saveAndFlush(formaDePago);

        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();

        // Update the formaDePago using partial update
        FormaDePago partialUpdatedFormaDePago = new FormaDePago();
        partialUpdatedFormaDePago.setId(formaDePago.getId());

        partialUpdatedFormaDePago.formaPago(UPDATED_FORMA_PAGO);

        restFormaDePagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormaDePago.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormaDePago))
            )
            .andExpect(status().isOk());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
        FormaDePago testFormaDePago = formaDePagoList.get(formaDePagoList.size() - 1);
        assertThat(testFormaDePago.getFormaPago()).isEqualTo(UPDATED_FORMA_PAGO);
    }

    @Test
    @Transactional
    void patchNonExistingFormaDePago() throws Exception {
        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();
        formaDePago.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormaDePagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formaDePago.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formaDePago))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormaDePago() throws Exception {
        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();
        formaDePago.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormaDePagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formaDePago))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormaDePago() throws Exception {
        int databaseSizeBeforeUpdate = formaDePagoRepository.findAll().size();
        formaDePago.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormaDePagoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(formaDePago))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormaDePago in the database
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormaDePago() throws Exception {
        // Initialize the database
        formaDePagoRepository.saveAndFlush(formaDePago);

        int databaseSizeBeforeDelete = formaDePagoRepository.findAll().size();

        // Delete the formaDePago
        restFormaDePagoMockMvc
            .perform(delete(ENTITY_API_URL_ID, formaDePago.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormaDePago> formaDePagoList = formaDePagoRepository.findAll();
        assertThat(formaDePagoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
