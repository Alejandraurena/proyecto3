package co.edu.sena.web.rest;

import static co.edu.sena.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Registro;
import co.edu.sena.domain.Vehiculo;
import co.edu.sena.repository.RegistroRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link RegistroResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RegistroResourceIT {

    private static final ZonedDateTime DEFAULT_HORA_INGRESO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_HORA_INGRESO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_HORA_SALIDA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_HORA_SALIDA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/registros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RegistroRepository registroRepository;

    @Mock
    private RegistroRepository registroRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegistroMockMvc;

    private Registro registro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Registro createEntity(EntityManager em) {
        Registro registro = new Registro().horaIngreso(DEFAULT_HORA_INGRESO).horaSalida(DEFAULT_HORA_SALIDA);
        // Add required entity
        Vehiculo vehiculo;
        if (TestUtil.findAll(em, Vehiculo.class).isEmpty()) {
            vehiculo = VehiculoResourceIT.createEntity(em);
            em.persist(vehiculo);
            em.flush();
        } else {
            vehiculo = TestUtil.findAll(em, Vehiculo.class).get(0);
        }
        registro.setVehiculo(vehiculo);
        return registro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Registro createUpdatedEntity(EntityManager em) {
        Registro registro = new Registro().horaIngreso(UPDATED_HORA_INGRESO).horaSalida(UPDATED_HORA_SALIDA);
        // Add required entity
        Vehiculo vehiculo;
        if (TestUtil.findAll(em, Vehiculo.class).isEmpty()) {
            vehiculo = VehiculoResourceIT.createUpdatedEntity(em);
            em.persist(vehiculo);
            em.flush();
        } else {
            vehiculo = TestUtil.findAll(em, Vehiculo.class).get(0);
        }
        registro.setVehiculo(vehiculo);
        return registro;
    }

    @BeforeEach
    public void initTest() {
        registro = createEntity(em);
    }

    @Test
    @Transactional
    void createRegistro() throws Exception {
        int databaseSizeBeforeCreate = registroRepository.findAll().size();
        // Create the Registro
        restRegistroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registro)))
            .andExpect(status().isCreated());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeCreate + 1);
        Registro testRegistro = registroList.get(registroList.size() - 1);
        assertThat(testRegistro.getHoraIngreso()).isEqualTo(DEFAULT_HORA_INGRESO);
        assertThat(testRegistro.getHoraSalida()).isEqualTo(DEFAULT_HORA_SALIDA);
    }

    @Test
    @Transactional
    void createRegistroWithExistingId() throws Exception {
        // Create the Registro with an existing ID
        registro.setId(1L);

        int databaseSizeBeforeCreate = registroRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegistroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registro)))
            .andExpect(status().isBadRequest());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkHoraIngresoIsRequired() throws Exception {
        int databaseSizeBeforeTest = registroRepository.findAll().size();
        // set the field null
        registro.setHoraIngreso(null);

        // Create the Registro, which fails.

        restRegistroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registro)))
            .andExpect(status().isBadRequest());

        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoraSalidaIsRequired() throws Exception {
        int databaseSizeBeforeTest = registroRepository.findAll().size();
        // set the field null
        registro.setHoraSalida(null);

        // Create the Registro, which fails.

        restRegistroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registro)))
            .andExpect(status().isBadRequest());

        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRegistros() throws Exception {
        // Initialize the database
        registroRepository.saveAndFlush(registro);

        // Get all the registroList
        restRegistroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registro.getId().intValue())))
            .andExpect(jsonPath("$.[*].horaIngreso").value(hasItem(sameInstant(DEFAULT_HORA_INGRESO))))
            .andExpect(jsonPath("$.[*].horaSalida").value(hasItem(sameInstant(DEFAULT_HORA_SALIDA))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRegistrosWithEagerRelationshipsIsEnabled() throws Exception {
        when(registroRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRegistroMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(registroRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRegistrosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(registroRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRegistroMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(registroRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getRegistro() throws Exception {
        // Initialize the database
        registroRepository.saveAndFlush(registro);

        // Get the registro
        restRegistroMockMvc
            .perform(get(ENTITY_API_URL_ID, registro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(registro.getId().intValue()))
            .andExpect(jsonPath("$.horaIngreso").value(sameInstant(DEFAULT_HORA_INGRESO)))
            .andExpect(jsonPath("$.horaSalida").value(sameInstant(DEFAULT_HORA_SALIDA)));
    }

    @Test
    @Transactional
    void getNonExistingRegistro() throws Exception {
        // Get the registro
        restRegistroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRegistro() throws Exception {
        // Initialize the database
        registroRepository.saveAndFlush(registro);

        int databaseSizeBeforeUpdate = registroRepository.findAll().size();

        // Update the registro
        Registro updatedRegistro = registroRepository.findById(registro.getId()).get();
        // Disconnect from session so that the updates on updatedRegistro are not directly saved in db
        em.detach(updatedRegistro);
        updatedRegistro.horaIngreso(UPDATED_HORA_INGRESO).horaSalida(UPDATED_HORA_SALIDA);

        restRegistroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRegistro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRegistro))
            )
            .andExpect(status().isOk());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
        Registro testRegistro = registroList.get(registroList.size() - 1);
        assertThat(testRegistro.getHoraIngreso()).isEqualTo(UPDATED_HORA_INGRESO);
        assertThat(testRegistro.getHoraSalida()).isEqualTo(UPDATED_HORA_SALIDA);
    }

    @Test
    @Transactional
    void putNonExistingRegistro() throws Exception {
        int databaseSizeBeforeUpdate = registroRepository.findAll().size();
        registro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, registro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegistro() throws Exception {
        int databaseSizeBeforeUpdate = registroRepository.findAll().size();
        registro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegistro() throws Exception {
        int databaseSizeBeforeUpdate = registroRepository.findAll().size();
        registro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegistroWithPatch() throws Exception {
        // Initialize the database
        registroRepository.saveAndFlush(registro);

        int databaseSizeBeforeUpdate = registroRepository.findAll().size();

        // Update the registro using partial update
        Registro partialUpdatedRegistro = new Registro();
        partialUpdatedRegistro.setId(registro.getId());

        restRegistroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistro))
            )
            .andExpect(status().isOk());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
        Registro testRegistro = registroList.get(registroList.size() - 1);
        assertThat(testRegistro.getHoraIngreso()).isEqualTo(DEFAULT_HORA_INGRESO);
        assertThat(testRegistro.getHoraSalida()).isEqualTo(DEFAULT_HORA_SALIDA);
    }

    @Test
    @Transactional
    void fullUpdateRegistroWithPatch() throws Exception {
        // Initialize the database
        registroRepository.saveAndFlush(registro);

        int databaseSizeBeforeUpdate = registroRepository.findAll().size();

        // Update the registro using partial update
        Registro partialUpdatedRegistro = new Registro();
        partialUpdatedRegistro.setId(registro.getId());

        partialUpdatedRegistro.horaIngreso(UPDATED_HORA_INGRESO).horaSalida(UPDATED_HORA_SALIDA);

        restRegistroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistro))
            )
            .andExpect(status().isOk());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
        Registro testRegistro = registroList.get(registroList.size() - 1);
        assertThat(testRegistro.getHoraIngreso()).isEqualTo(UPDATED_HORA_INGRESO);
        assertThat(testRegistro.getHoraSalida()).isEqualTo(UPDATED_HORA_SALIDA);
    }

    @Test
    @Transactional
    void patchNonExistingRegistro() throws Exception {
        int databaseSizeBeforeUpdate = registroRepository.findAll().size();
        registro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, registro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegistro() throws Exception {
        int databaseSizeBeforeUpdate = registroRepository.findAll().size();
        registro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegistro() throws Exception {
        int databaseSizeBeforeUpdate = registroRepository.findAll().size();
        registro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(registro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Registro in the database
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegistro() throws Exception {
        // Initialize the database
        registroRepository.saveAndFlush(registro);

        int databaseSizeBeforeDelete = registroRepository.findAll().size();

        // Delete the registro
        restRegistroMockMvc
            .perform(delete(ENTITY_API_URL_ID, registro.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Registro> registroList = registroRepository.findAll();
        assertThat(registroList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
