package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Facturacion;
import co.edu.sena.domain.TipoVehiculo;
import co.edu.sena.repository.TipoVehiculoRepository;
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
 * Integration tests for the {@link TipoVehiculoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TipoVehiculoResourceIT {

    private static final String DEFAULT_TIPO_VEHICULO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_VEHICULO = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA_VEHICULO = "AAAAAAAAAA";
    private static final String UPDATED_MARCA_VEHICULO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tipo-vehiculos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TipoVehiculoRepository tipoVehiculoRepository;

    @Mock
    private TipoVehiculoRepository tipoVehiculoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTipoVehiculoMockMvc;

    private TipoVehiculo tipoVehiculo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoVehiculo createEntity(EntityManager em) {
        TipoVehiculo tipoVehiculo = new TipoVehiculo().tipoVehiculo(DEFAULT_TIPO_VEHICULO).marcaVehiculo(DEFAULT_MARCA_VEHICULO);
        // Add required entity
        Facturacion facturacion;
        if (TestUtil.findAll(em, Facturacion.class).isEmpty()) {
            facturacion = FacturacionResourceIT.createEntity(em);
            em.persist(facturacion);
            em.flush();
        } else {
            facturacion = TestUtil.findAll(em, Facturacion.class).get(0);
        }
        tipoVehiculo.setFacturacion(facturacion);
        return tipoVehiculo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoVehiculo createUpdatedEntity(EntityManager em) {
        TipoVehiculo tipoVehiculo = new TipoVehiculo().tipoVehiculo(UPDATED_TIPO_VEHICULO).marcaVehiculo(UPDATED_MARCA_VEHICULO);
        // Add required entity
        Facturacion facturacion;
        if (TestUtil.findAll(em, Facturacion.class).isEmpty()) {
            facturacion = FacturacionResourceIT.createUpdatedEntity(em);
            em.persist(facturacion);
            em.flush();
        } else {
            facturacion = TestUtil.findAll(em, Facturacion.class).get(0);
        }
        tipoVehiculo.setFacturacion(facturacion);
        return tipoVehiculo;
    }

    @BeforeEach
    public void initTest() {
        tipoVehiculo = createEntity(em);
    }

    @Test
    @Transactional
    void createTipoVehiculo() throws Exception {
        int databaseSizeBeforeCreate = tipoVehiculoRepository.findAll().size();
        // Create the TipoVehiculo
        restTipoVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoVehiculo)))
            .andExpect(status().isCreated());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeCreate + 1);
        TipoVehiculo testTipoVehiculo = tipoVehiculoList.get(tipoVehiculoList.size() - 1);
        assertThat(testTipoVehiculo.getTipoVehiculo()).isEqualTo(DEFAULT_TIPO_VEHICULO);
        assertThat(testTipoVehiculo.getMarcaVehiculo()).isEqualTo(DEFAULT_MARCA_VEHICULO);
    }

    @Test
    @Transactional
    void createTipoVehiculoWithExistingId() throws Exception {
        // Create the TipoVehiculo with an existing ID
        tipoVehiculo.setId(1L);

        int databaseSizeBeforeCreate = tipoVehiculoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoVehiculo)))
            .andExpect(status().isBadRequest());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTipoVehiculoIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipoVehiculoRepository.findAll().size();
        // set the field null
        tipoVehiculo.setTipoVehiculo(null);

        // Create the TipoVehiculo, which fails.

        restTipoVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoVehiculo)))
            .andExpect(status().isBadRequest());

        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMarcaVehiculoIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipoVehiculoRepository.findAll().size();
        // set the field null
        tipoVehiculo.setMarcaVehiculo(null);

        // Create the TipoVehiculo, which fails.

        restTipoVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoVehiculo)))
            .andExpect(status().isBadRequest());

        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTipoVehiculos() throws Exception {
        // Initialize the database
        tipoVehiculoRepository.saveAndFlush(tipoVehiculo);

        // Get all the tipoVehiculoList
        restTipoVehiculoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoVehiculo.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipoVehiculo").value(hasItem(DEFAULT_TIPO_VEHICULO)))
            .andExpect(jsonPath("$.[*].marcaVehiculo").value(hasItem(DEFAULT_MARCA_VEHICULO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTipoVehiculosWithEagerRelationshipsIsEnabled() throws Exception {
        when(tipoVehiculoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTipoVehiculoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(tipoVehiculoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTipoVehiculosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(tipoVehiculoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTipoVehiculoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(tipoVehiculoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getTipoVehiculo() throws Exception {
        // Initialize the database
        tipoVehiculoRepository.saveAndFlush(tipoVehiculo);

        // Get the tipoVehiculo
        restTipoVehiculoMockMvc
            .perform(get(ENTITY_API_URL_ID, tipoVehiculo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tipoVehiculo.getId().intValue()))
            .andExpect(jsonPath("$.tipoVehiculo").value(DEFAULT_TIPO_VEHICULO))
            .andExpect(jsonPath("$.marcaVehiculo").value(DEFAULT_MARCA_VEHICULO));
    }

    @Test
    @Transactional
    void getNonExistingTipoVehiculo() throws Exception {
        // Get the tipoVehiculo
        restTipoVehiculoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTipoVehiculo() throws Exception {
        // Initialize the database
        tipoVehiculoRepository.saveAndFlush(tipoVehiculo);

        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();

        // Update the tipoVehiculo
        TipoVehiculo updatedTipoVehiculo = tipoVehiculoRepository.findById(tipoVehiculo.getId()).get();
        // Disconnect from session so that the updates on updatedTipoVehiculo are not directly saved in db
        em.detach(updatedTipoVehiculo);
        updatedTipoVehiculo.tipoVehiculo(UPDATED_TIPO_VEHICULO).marcaVehiculo(UPDATED_MARCA_VEHICULO);

        restTipoVehiculoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTipoVehiculo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTipoVehiculo))
            )
            .andExpect(status().isOk());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
        TipoVehiculo testTipoVehiculo = tipoVehiculoList.get(tipoVehiculoList.size() - 1);
        assertThat(testTipoVehiculo.getTipoVehiculo()).isEqualTo(UPDATED_TIPO_VEHICULO);
        assertThat(testTipoVehiculo.getMarcaVehiculo()).isEqualTo(UPDATED_MARCA_VEHICULO);
    }

    @Test
    @Transactional
    void putNonExistingTipoVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();
        tipoVehiculo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoVehiculoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tipoVehiculo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tipoVehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTipoVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();
        tipoVehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoVehiculoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tipoVehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTipoVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();
        tipoVehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoVehiculoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tipoVehiculo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTipoVehiculoWithPatch() throws Exception {
        // Initialize the database
        tipoVehiculoRepository.saveAndFlush(tipoVehiculo);

        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();

        // Update the tipoVehiculo using partial update
        TipoVehiculo partialUpdatedTipoVehiculo = new TipoVehiculo();
        partialUpdatedTipoVehiculo.setId(tipoVehiculo.getId());

        partialUpdatedTipoVehiculo.tipoVehiculo(UPDATED_TIPO_VEHICULO);

        restTipoVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoVehiculo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTipoVehiculo))
            )
            .andExpect(status().isOk());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
        TipoVehiculo testTipoVehiculo = tipoVehiculoList.get(tipoVehiculoList.size() - 1);
        assertThat(testTipoVehiculo.getTipoVehiculo()).isEqualTo(UPDATED_TIPO_VEHICULO);
        assertThat(testTipoVehiculo.getMarcaVehiculo()).isEqualTo(DEFAULT_MARCA_VEHICULO);
    }

    @Test
    @Transactional
    void fullUpdateTipoVehiculoWithPatch() throws Exception {
        // Initialize the database
        tipoVehiculoRepository.saveAndFlush(tipoVehiculo);

        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();

        // Update the tipoVehiculo using partial update
        TipoVehiculo partialUpdatedTipoVehiculo = new TipoVehiculo();
        partialUpdatedTipoVehiculo.setId(tipoVehiculo.getId());

        partialUpdatedTipoVehiculo.tipoVehiculo(UPDATED_TIPO_VEHICULO).marcaVehiculo(UPDATED_MARCA_VEHICULO);

        restTipoVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTipoVehiculo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTipoVehiculo))
            )
            .andExpect(status().isOk());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
        TipoVehiculo testTipoVehiculo = tipoVehiculoList.get(tipoVehiculoList.size() - 1);
        assertThat(testTipoVehiculo.getTipoVehiculo()).isEqualTo(UPDATED_TIPO_VEHICULO);
        assertThat(testTipoVehiculo.getMarcaVehiculo()).isEqualTo(UPDATED_MARCA_VEHICULO);
    }

    @Test
    @Transactional
    void patchNonExistingTipoVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();
        tipoVehiculo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tipoVehiculo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tipoVehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTipoVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();
        tipoVehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tipoVehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTipoVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = tipoVehiculoRepository.findAll().size();
        tipoVehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTipoVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tipoVehiculo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TipoVehiculo in the database
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTipoVehiculo() throws Exception {
        // Initialize the database
        tipoVehiculoRepository.saveAndFlush(tipoVehiculo);

        int databaseSizeBeforeDelete = tipoVehiculoRepository.findAll().size();

        // Delete the tipoVehiculo
        restTipoVehiculoMockMvc
            .perform(delete(ENTITY_API_URL_ID, tipoVehiculo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TipoVehiculo> tipoVehiculoList = tipoVehiculoRepository.findAll();
        assertThat(tipoVehiculoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
