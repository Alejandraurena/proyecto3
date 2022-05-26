package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Facturacion;
import co.edu.sena.domain.FormaDePago;
import co.edu.sena.repository.FacturacionRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link FacturacionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FacturacionResourceIT {

    private static final LocalDate DEFAULT_FECHA_FACTURA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_FACTURA = LocalDate.now(ZoneId.systemDefault());

    private static final Float DEFAULT_VALOR_FACTURA = 1F;
    private static final Float UPDATED_VALOR_FACTURA = 2F;

    private static final String ENTITY_API_URL = "/api/facturacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FacturacionRepository facturacionRepository;

    @Mock
    private FacturacionRepository facturacionRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFacturacionMockMvc;

    private Facturacion facturacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facturacion createEntity(EntityManager em) {
        Facturacion facturacion = new Facturacion().fechaFactura(DEFAULT_FECHA_FACTURA).valorFactura(DEFAULT_VALOR_FACTURA);
        // Add required entity
        FormaDePago formaDePago;
        if (TestUtil.findAll(em, FormaDePago.class).isEmpty()) {
            formaDePago = FormaDePagoResourceIT.createEntity(em);
            em.persist(formaDePago);
            em.flush();
        } else {
            formaDePago = TestUtil.findAll(em, FormaDePago.class).get(0);
        }
        facturacion.setFormaDepago(formaDePago);
        return facturacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facturacion createUpdatedEntity(EntityManager em) {
        Facturacion facturacion = new Facturacion().fechaFactura(UPDATED_FECHA_FACTURA).valorFactura(UPDATED_VALOR_FACTURA);
        // Add required entity
        FormaDePago formaDePago;
        if (TestUtil.findAll(em, FormaDePago.class).isEmpty()) {
            formaDePago = FormaDePagoResourceIT.createUpdatedEntity(em);
            em.persist(formaDePago);
            em.flush();
        } else {
            formaDePago = TestUtil.findAll(em, FormaDePago.class).get(0);
        }
        facturacion.setFormaDepago(formaDePago);
        return facturacion;
    }

    @BeforeEach
    public void initTest() {
        facturacion = createEntity(em);
    }

    @Test
    @Transactional
    void createFacturacion() throws Exception {
        int databaseSizeBeforeCreate = facturacionRepository.findAll().size();
        // Create the Facturacion
        restFacturacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(facturacion)))
            .andExpect(status().isCreated());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeCreate + 1);
        Facturacion testFacturacion = facturacionList.get(facturacionList.size() - 1);
        assertThat(testFacturacion.getFechaFactura()).isEqualTo(DEFAULT_FECHA_FACTURA);
        assertThat(testFacturacion.getValorFactura()).isEqualTo(DEFAULT_VALOR_FACTURA);
    }

    @Test
    @Transactional
    void createFacturacionWithExistingId() throws Exception {
        // Create the Facturacion with an existing ID
        facturacion.setId(1L);

        int databaseSizeBeforeCreate = facturacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFacturacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(facturacion)))
            .andExpect(status().isBadRequest());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFechaFacturaIsRequired() throws Exception {
        int databaseSizeBeforeTest = facturacionRepository.findAll().size();
        // set the field null
        facturacion.setFechaFactura(null);

        // Create the Facturacion, which fails.

        restFacturacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(facturacion)))
            .andExpect(status().isBadRequest());

        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValorFacturaIsRequired() throws Exception {
        int databaseSizeBeforeTest = facturacionRepository.findAll().size();
        // set the field null
        facturacion.setValorFactura(null);

        // Create the Facturacion, which fails.

        restFacturacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(facturacion)))
            .andExpect(status().isBadRequest());

        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFacturacions() throws Exception {
        // Initialize the database
        facturacionRepository.saveAndFlush(facturacion);

        // Get all the facturacionList
        restFacturacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(facturacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].fechaFactura").value(hasItem(DEFAULT_FECHA_FACTURA.toString())))
            .andExpect(jsonPath("$.[*].valorFactura").value(hasItem(DEFAULT_VALOR_FACTURA.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFacturacionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(facturacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFacturacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(facturacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFacturacionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(facturacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFacturacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(facturacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getFacturacion() throws Exception {
        // Initialize the database
        facturacionRepository.saveAndFlush(facturacion);

        // Get the facturacion
        restFacturacionMockMvc
            .perform(get(ENTITY_API_URL_ID, facturacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(facturacion.getId().intValue()))
            .andExpect(jsonPath("$.fechaFactura").value(DEFAULT_FECHA_FACTURA.toString()))
            .andExpect(jsonPath("$.valorFactura").value(DEFAULT_VALOR_FACTURA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingFacturacion() throws Exception {
        // Get the facturacion
        restFacturacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFacturacion() throws Exception {
        // Initialize the database
        facturacionRepository.saveAndFlush(facturacion);

        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();

        // Update the facturacion
        Facturacion updatedFacturacion = facturacionRepository.findById(facturacion.getId()).get();
        // Disconnect from session so that the updates on updatedFacturacion are not directly saved in db
        em.detach(updatedFacturacion);
        updatedFacturacion.fechaFactura(UPDATED_FECHA_FACTURA).valorFactura(UPDATED_VALOR_FACTURA);

        restFacturacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFacturacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFacturacion))
            )
            .andExpect(status().isOk());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
        Facturacion testFacturacion = facturacionList.get(facturacionList.size() - 1);
        assertThat(testFacturacion.getFechaFactura()).isEqualTo(UPDATED_FECHA_FACTURA);
        assertThat(testFacturacion.getValorFactura()).isEqualTo(UPDATED_VALOR_FACTURA);
    }

    @Test
    @Transactional
    void putNonExistingFacturacion() throws Exception {
        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();
        facturacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFacturacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, facturacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(facturacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFacturacion() throws Exception {
        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();
        facturacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(facturacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFacturacion() throws Exception {
        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();
        facturacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturacionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(facturacion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFacturacionWithPatch() throws Exception {
        // Initialize the database
        facturacionRepository.saveAndFlush(facturacion);

        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();

        // Update the facturacion using partial update
        Facturacion partialUpdatedFacturacion = new Facturacion();
        partialUpdatedFacturacion.setId(facturacion.getId());

        partialUpdatedFacturacion.fechaFactura(UPDATED_FECHA_FACTURA);

        restFacturacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFacturacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFacturacion))
            )
            .andExpect(status().isOk());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
        Facturacion testFacturacion = facturacionList.get(facturacionList.size() - 1);
        assertThat(testFacturacion.getFechaFactura()).isEqualTo(UPDATED_FECHA_FACTURA);
        assertThat(testFacturacion.getValorFactura()).isEqualTo(DEFAULT_VALOR_FACTURA);
    }

    @Test
    @Transactional
    void fullUpdateFacturacionWithPatch() throws Exception {
        // Initialize the database
        facturacionRepository.saveAndFlush(facturacion);

        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();

        // Update the facturacion using partial update
        Facturacion partialUpdatedFacturacion = new Facturacion();
        partialUpdatedFacturacion.setId(facturacion.getId());

        partialUpdatedFacturacion.fechaFactura(UPDATED_FECHA_FACTURA).valorFactura(UPDATED_VALOR_FACTURA);

        restFacturacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFacturacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFacturacion))
            )
            .andExpect(status().isOk());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
        Facturacion testFacturacion = facturacionList.get(facturacionList.size() - 1);
        assertThat(testFacturacion.getFechaFactura()).isEqualTo(UPDATED_FECHA_FACTURA);
        assertThat(testFacturacion.getValorFactura()).isEqualTo(UPDATED_VALOR_FACTURA);
    }

    @Test
    @Transactional
    void patchNonExistingFacturacion() throws Exception {
        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();
        facturacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFacturacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, facturacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(facturacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFacturacion() throws Exception {
        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();
        facturacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(facturacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFacturacion() throws Exception {
        int databaseSizeBeforeUpdate = facturacionRepository.findAll().size();
        facturacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFacturacionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(facturacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Facturacion in the database
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFacturacion() throws Exception {
        // Initialize the database
        facturacionRepository.saveAndFlush(facturacion);

        int databaseSizeBeforeDelete = facturacionRepository.findAll().size();

        // Delete the facturacion
        restFacturacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, facturacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Facturacion> facturacionList = facturacionRepository.findAll();
        assertThat(facturacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
