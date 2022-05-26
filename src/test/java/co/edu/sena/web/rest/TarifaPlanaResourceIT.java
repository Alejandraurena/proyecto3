package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Cliente;
import co.edu.sena.domain.Facturacion;
import co.edu.sena.domain.TarifaPlana;
import co.edu.sena.repository.TarifaPlanaRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TarifaPlanaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TarifaPlanaResourceIT {

    private static final Float DEFAULT_VALOR = 1F;
    private static final Float UPDATED_VALOR = 2F;

    private static final String DEFAULT_FECHA_PAGO = "AAAAAAAAAA";
    private static final String UPDATED_FECHA_PAGO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tarifa-planas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TarifaPlanaRepository tarifaPlanaRepository;

    @Mock
    private TarifaPlanaRepository tarifaPlanaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTarifaPlanaMockMvc;

    private TarifaPlana tarifaPlana;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TarifaPlana createEntity(EntityManager em) {
        TarifaPlana tarifaPlana = new TarifaPlana().valor(DEFAULT_VALOR).fechaPago(DEFAULT_FECHA_PAGO);
        // Add required entity
        Facturacion facturacion;
        if (TestUtil.findAll(em, Facturacion.class).isEmpty()) {
            facturacion = FacturacionResourceIT.createEntity(em);
            em.persist(facturacion);
            em.flush();
        } else {
            facturacion = TestUtil.findAll(em, Facturacion.class).get(0);
        }
        tarifaPlana.setFacturacion(facturacion);
        // Add required entity
        Cliente cliente;
        if (TestUtil.findAll(em, Cliente.class).isEmpty()) {
            cliente = ClienteResourceIT.createEntity(em);
            em.persist(cliente);
            em.flush();
        } else {
            cliente = TestUtil.findAll(em, Cliente.class).get(0);
        }
        tarifaPlana.setCliente(cliente);
        return tarifaPlana;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TarifaPlana createUpdatedEntity(EntityManager em) {
        TarifaPlana tarifaPlana = new TarifaPlana().valor(UPDATED_VALOR).fechaPago(UPDATED_FECHA_PAGO);
        // Add required entity
        Facturacion facturacion;
        if (TestUtil.findAll(em, Facturacion.class).isEmpty()) {
            facturacion = FacturacionResourceIT.createUpdatedEntity(em);
            em.persist(facturacion);
            em.flush();
        } else {
            facturacion = TestUtil.findAll(em, Facturacion.class).get(0);
        }
        tarifaPlana.setFacturacion(facturacion);
        // Add required entity
        Cliente cliente;
        if (TestUtil.findAll(em, Cliente.class).isEmpty()) {
            cliente = ClienteResourceIT.createUpdatedEntity(em);
            em.persist(cliente);
            em.flush();
        } else {
            cliente = TestUtil.findAll(em, Cliente.class).get(0);
        }
        tarifaPlana.setCliente(cliente);
        return tarifaPlana;
    }

    @BeforeEach
    public void initTest() {
        tarifaPlana = createEntity(em);
    }

    @Test
    @Transactional
    void createTarifaPlana() throws Exception {
        int databaseSizeBeforeCreate = tarifaPlanaRepository.findAll().size();
        // Create the TarifaPlana
        restTarifaPlanaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarifaPlana)))
            .andExpect(status().isCreated());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeCreate + 1);
        TarifaPlana testTarifaPlana = tarifaPlanaList.get(tarifaPlanaList.size() - 1);
        assertThat(testTarifaPlana.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testTarifaPlana.getFechaPago()).isEqualTo(DEFAULT_FECHA_PAGO);
    }

    @Test
    @Transactional
    void createTarifaPlanaWithExistingId() throws Exception {
        // Create the TarifaPlana with an existing ID
        tarifaPlana.setId(1L);

        int databaseSizeBeforeCreate = tarifaPlanaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTarifaPlanaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarifaPlana)))
            .andExpect(status().isBadRequest());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValorIsRequired() throws Exception {
        int databaseSizeBeforeTest = tarifaPlanaRepository.findAll().size();
        // set the field null
        tarifaPlana.setValor(null);

        // Create the TarifaPlana, which fails.

        restTarifaPlanaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarifaPlana)))
            .andExpect(status().isBadRequest());

        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFechaPagoIsRequired() throws Exception {
        int databaseSizeBeforeTest = tarifaPlanaRepository.findAll().size();
        // set the field null
        tarifaPlana.setFechaPago(null);

        // Create the TarifaPlana, which fails.

        restTarifaPlanaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarifaPlana)))
            .andExpect(status().isBadRequest());

        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTarifaPlanas() throws Exception {
        // Initialize the database
        tarifaPlanaRepository.saveAndFlush(tarifaPlana);

        // Get all the tarifaPlanaList
        restTarifaPlanaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tarifaPlana.getId().intValue())))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())))
            .andExpect(jsonPath("$.[*].fechaPago").value(hasItem(DEFAULT_FECHA_PAGO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTarifaPlanasWithEagerRelationshipsIsEnabled() throws Exception {
        when(tarifaPlanaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTarifaPlanaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(tarifaPlanaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTarifaPlanasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(tarifaPlanaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTarifaPlanaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(tarifaPlanaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getTarifaPlana() throws Exception {
        // Initialize the database
        tarifaPlanaRepository.saveAndFlush(tarifaPlana);

        // Get the tarifaPlana
        restTarifaPlanaMockMvc
            .perform(get(ENTITY_API_URL_ID, tarifaPlana.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tarifaPlana.getId().intValue()))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()))
            .andExpect(jsonPath("$.fechaPago").value(DEFAULT_FECHA_PAGO));
    }

    @Test
    @Transactional
    void getNonExistingTarifaPlana() throws Exception {
        // Get the tarifaPlana
        restTarifaPlanaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTarifaPlana() throws Exception {
        // Initialize the database
        tarifaPlanaRepository.saveAndFlush(tarifaPlana);

        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();

        // Update the tarifaPlana
        TarifaPlana updatedTarifaPlana = tarifaPlanaRepository.findById(tarifaPlana.getId()).get();
        // Disconnect from session so that the updates on updatedTarifaPlana are not directly saved in db
        em.detach(updatedTarifaPlana);
        updatedTarifaPlana.valor(UPDATED_VALOR).fechaPago(UPDATED_FECHA_PAGO);

        restTarifaPlanaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTarifaPlana.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTarifaPlana))
            )
            .andExpect(status().isOk());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
        TarifaPlana testTarifaPlana = tarifaPlanaList.get(tarifaPlanaList.size() - 1);
        assertThat(testTarifaPlana.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testTarifaPlana.getFechaPago()).isEqualTo(UPDATED_FECHA_PAGO);
    }

    @Test
    @Transactional
    void putNonExistingTarifaPlana() throws Exception {
        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();
        tarifaPlana.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTarifaPlanaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tarifaPlana.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tarifaPlana))
            )
            .andExpect(status().isBadRequest());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTarifaPlana() throws Exception {
        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();
        tarifaPlana.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarifaPlanaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tarifaPlana))
            )
            .andExpect(status().isBadRequest());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTarifaPlana() throws Exception {
        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();
        tarifaPlana.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarifaPlanaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tarifaPlana)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTarifaPlanaWithPatch() throws Exception {
        // Initialize the database
        tarifaPlanaRepository.saveAndFlush(tarifaPlana);

        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();

        // Update the tarifaPlana using partial update
        TarifaPlana partialUpdatedTarifaPlana = new TarifaPlana();
        partialUpdatedTarifaPlana.setId(tarifaPlana.getId());

        partialUpdatedTarifaPlana.fechaPago(UPDATED_FECHA_PAGO);

        restTarifaPlanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTarifaPlana.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTarifaPlana))
            )
            .andExpect(status().isOk());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
        TarifaPlana testTarifaPlana = tarifaPlanaList.get(tarifaPlanaList.size() - 1);
        assertThat(testTarifaPlana.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testTarifaPlana.getFechaPago()).isEqualTo(UPDATED_FECHA_PAGO);
    }

    @Test
    @Transactional
    void fullUpdateTarifaPlanaWithPatch() throws Exception {
        // Initialize the database
        tarifaPlanaRepository.saveAndFlush(tarifaPlana);

        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();

        // Update the tarifaPlana using partial update
        TarifaPlana partialUpdatedTarifaPlana = new TarifaPlana();
        partialUpdatedTarifaPlana.setId(tarifaPlana.getId());

        partialUpdatedTarifaPlana.valor(UPDATED_VALOR).fechaPago(UPDATED_FECHA_PAGO);

        restTarifaPlanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTarifaPlana.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTarifaPlana))
            )
            .andExpect(status().isOk());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
        TarifaPlana testTarifaPlana = tarifaPlanaList.get(tarifaPlanaList.size() - 1);
        assertThat(testTarifaPlana.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testTarifaPlana.getFechaPago()).isEqualTo(UPDATED_FECHA_PAGO);
    }

    @Test
    @Transactional
    void patchNonExistingTarifaPlana() throws Exception {
        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();
        tarifaPlana.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTarifaPlanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tarifaPlana.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tarifaPlana))
            )
            .andExpect(status().isBadRequest());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTarifaPlana() throws Exception {
        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();
        tarifaPlana.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarifaPlanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tarifaPlana))
            )
            .andExpect(status().isBadRequest());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTarifaPlana() throws Exception {
        int databaseSizeBeforeUpdate = tarifaPlanaRepository.findAll().size();
        tarifaPlana.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTarifaPlanaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tarifaPlana))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TarifaPlana in the database
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTarifaPlana() throws Exception {
        // Initialize the database
        tarifaPlanaRepository.saveAndFlush(tarifaPlana);

        int databaseSizeBeforeDelete = tarifaPlanaRepository.findAll().size();

        // Delete the tarifaPlana
        restTarifaPlanaMockMvc
            .perform(delete(ENTITY_API_URL_ID, tarifaPlana.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TarifaPlana> tarifaPlanaList = tarifaPlanaRepository.findAll();
        assertThat(tarifaPlanaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
