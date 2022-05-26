package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TarifaPlanaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TarifaPlana.class);
        TarifaPlana tarifaPlana1 = new TarifaPlana();
        tarifaPlana1.setId(1L);
        TarifaPlana tarifaPlana2 = new TarifaPlana();
        tarifaPlana2.setId(tarifaPlana1.getId());
        assertThat(tarifaPlana1).isEqualTo(tarifaPlana2);
        tarifaPlana2.setId(2L);
        assertThat(tarifaPlana1).isNotEqualTo(tarifaPlana2);
        tarifaPlana1.setId(null);
        assertThat(tarifaPlana1).isNotEqualTo(tarifaPlana2);
    }
}
